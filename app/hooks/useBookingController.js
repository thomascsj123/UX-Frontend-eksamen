import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Statisk opsætning af etager, lokaler og tidsrum
const FLOORS = ['1 sal', '2 sal', '3 sal', '4 sal']
const ROOMS = {
  '1 sal': ['1.1', '1.2', '1.3'],
  '2 sal': ['2.1', '2.2', '2.3'],
  '3 sal': ['3.1', '3.2', '3.3 '],
  '4 sal': ['4.1', '4.2', '4.3']
}

const DEFAULT_TIME_SLOTS = [
  '08:00-09:15', '09:30-10:45', '11:00-12:15', '12:30-13:45',
  '15:30-16:45', '17:00-18:15', '18:30-19:45', '20:00-21:15', '23:00-00:15'
]

// Samler al booking-state, datofetch og Supabase sideeffekter i et sted
export function useBookingController(options = {}) {
  const timeSlots = options.timeSlots ?? DEFAULT_TIME_SLOTS
  const roomType = options.roomType ?? 'undervisningslokale' // Default to 'undervisningslokale'
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedFloor, setSelectedFloor] = useState('3 sal')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [participantEmail, setParticipantEmail] = useState('')
  const [participants, setParticipants] = useState([])
  const [validationErrors, setValidationErrors] = useState({})
  const [hasAttemptedBooking, setHasAttemptedBooking] = useState(false)
  const [bookedTimeSlots, setBookedTimeSlots] = useState([])
  const [userRole, setUserRole] = useState('studerende')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false)
  const [deleteTargetSlot, setDeleteTargetSlot] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Helper function to check if two time ranges overlap
  const doTimeRangesOverlap = (start1, end1, start2, end2) => {
    // Two ranges overlap if: start1 < end2 AND start2 < end1
    return start1 < end2 && start2 < end1
  }

  // Overvåger ændringer i dato/lokale og henter bookinger fra Supabase
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedDate || !selectedRoom) {
        setBookedTimeSlots([])
        return
      }

      try {
        // Query a wider range to catch bookings that might end on the next day
        const startOfDay = new Date(selectedDate)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfNextDay = new Date(selectedDate)
        endOfNextDay.setDate(endOfNextDay.getDate() + 1)
        endOfNextDay.setHours(23, 59, 59, 999)

        const { data, error } = await supabase
          .from('session-table')
          .select('starts_at, ends_at')
          .eq('room_id', selectedRoom)
          .gte('ends_at', startOfDay.toISOString())
          .lte('ends_at', endOfNextDay.toISOString())

        if (error) {
          console.error('Error fetching bookings:', error)
          return
        }

        console.log('Fetched bookings:', data)
        console.log('Selected date:', selectedDate)
        console.log('Selected room:', selectedRoom)

        const booked = []
        if (data && data.length > 0) {
          const bookedSet = new Set()

          data.forEach(booking => {
            // Get booking time range
            const bookingStart = booking.starts_at ? new Date(booking.starts_at) : null
            const bookingEnd = new Date(booking.ends_at)
            
            // If starts_at doesn't exist (old bookings), try to infer it or skip overlap check
            if (!bookingStart) {
              console.log('Warning: Booking missing starts_at, using end time matching only:', booking.ends_at)
              // Fallback to old matching logic for backwards compatibility
              const endHour = bookingEnd.getHours()
              const endMinute = bookingEnd.getMinutes()
              
              timeSlots.forEach(slot => {
                const [start, end] = slot.split('-')
                const [endHourStr, endMinuteStr] = end.split(':')
                const slotEndHour = parseInt(endHourStr, 10)
                const slotEndMinute = parseInt(endMinuteStr, 10)
                
                if (endHour === slotEndHour && endMinute === slotEndMinute) {
                  bookedSet.add(slot)
                }
              })
              return
            }

            console.log(`Checking booking from ${bookingStart.toISOString()} to ${bookingEnd.toISOString()}`)

            // For each time slot, check if it overlaps with this booking
            timeSlots.forEach(slot => {
              const [startStr, endStr] = slot.split('-')
              const [startHour, startMinute] = startStr.split(':').map(Number)
              const [endHour, endMinute] = endStr.split(':').map(Number)
              
              // Calculate time slot start and end times
              const slotStart = new Date(selectedDate)
              slotStart.setHours(startHour, startMinute, 0, 0)
              
              const slotEnd = new Date(selectedDate)
              const crossesMidnight = endHour < startHour || (endHour === startHour && endMinute < startMinute)
              if (crossesMidnight) {
                slotEnd.setDate(slotEnd.getDate() + 1)
              }
              slotEnd.setHours(endHour, endMinute, 0, 0)

              // Check if booking overlaps with this time slot
              if (doTimeRangesOverlap(bookingStart, bookingEnd, slotStart, slotEnd)) {
                bookedSet.add(slot)
                console.log(`✓ Slot ${slot} overlaps with booking (${bookingStart.toISOString()} - ${bookingEnd.toISOString()})`)
              }
            })
          })

          booked.push(...Array.from(bookedSet))
        }

        console.log('Booked time slots:', booked)
        setBookedTimeSlots(booked)
      } catch (error) {
        console.error('Unexpected error fetching bookings:', error)
      }
    }

    fetchBookings()
  }, [selectedDate, selectedRoom, timeSlots, refreshTrigger])

  const handleMonthChange = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1))
  }

  const handleRoomToggle = (room) => {
    const newRoom = room === selectedRoom ? null : room
    setSelectedRoom(newRoom)
    if (newRoom) {
      setValidationErrors(prev => ({ ...prev, room: undefined }))
    }
  }

  const handleFloorChange = (floor) => {
    setSelectedFloor(floor)
    setSelectedRoom(null)
  }

  const handleAddParticipant = (e) => {
    e.preventDefault()
    if (participantEmail && !participants.includes(participantEmail)) {
      setParticipants([...participants, participantEmail])
      setParticipantEmail('')
    }
  }

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot)
    setValidationErrors(prev => ({ ...prev, timeSlot: undefined }))
  }

  const calculateEndTime = (date, timeSlot) => {
    const [start, end] = timeSlot.split('-')
    const [startHour, startMinute] = start.split(':').map(Number)
    const [hours, minutes] = end.split(':').map(Number)
    const endDate = new Date(date)
    const crossesMidnight =
      hours < startHour || (hours === startHour && minutes < startMinute)

    if (crossesMidnight) {
      endDate.setDate(endDate.getDate() + 1)
    }

    endDate.setHours(hours, minutes, 0, 0)
    return endDate.toISOString()
  }

  const formatDateForPreview = (date) => {
    const dayName = date.toLocaleDateString('da-DK', { weekday: 'long' })
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${dayName} d. ${day}/${month}/${year}`
  }

  // Validerer input og åbner bekræftelsesdialog
  const handleBook = () => {
    setHasAttemptedBooking(true)
    const errors = {}
    if (!selectedRoom) errors.room = true
    if (!selectedTimeSlot) errors.timeSlot = true

    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return
    // Hvis tidsrummet allerede er optaget, gør vi bare ingenting 
    if (bookedTimeSlots.includes(selectedTimeSlot)) return

    setShowConfirmDialog(true)
  }

  // Sender booking til Supabase og opdaterer lokal state
  const handleConfirmBooking = async () => {
    try {
      if (bookedTimeSlots.includes(selectedTimeSlot)) {
        alert('Dette tidsrum er allerede optaget!')
        setShowConfirmDialog(false)
        return
      }

      // Calculate the time range for the new booking
      const endsAt = calculateEndTime(selectedDate, selectedTimeSlot)
      const [start, end] = selectedTimeSlot.split('-')
      const [startHour, startMinute] = start.split(':').map(Number)
      const startDate = new Date(selectedDate)
      startDate.setHours(startHour, startMinute, 0, 0)
      const startsAt = startDate.toISOString()
      
      const newBookingStart = new Date(startsAt)
      const newBookingEnd = new Date(endsAt)
      
      // Check for overlaps with existing bookings
      const startOfDay = new Date(selectedDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfNextDay = new Date(selectedDate)
      endOfNextDay.setDate(endOfNextDay.getDate() + 1)
      endOfNextDay.setHours(23, 59, 59, 999)
      
      const { data: existingBookings } = await supabase
        .from('session-table')
        .select('starts_at, ends_at')
        .eq('room_id', selectedRoom)
        .gte('ends_at', startOfDay.toISOString())
        .lte('ends_at', endOfNextDay.toISOString())
      
      if (existingBookings) {
        for (const existing of existingBookings) {
          const existingStart = existing.starts_at ? new Date(existing.starts_at) : null
          const existingEnd = new Date(existing.ends_at)
          
          // If starts_at exists, check for overlap
          if (existingStart && doTimeRangesOverlap(newBookingStart, newBookingEnd, existingStart, existingEnd)) {
            alert('Denne booking overlapper med en eksisterende booking!')
            setShowConfirmDialog(false)
            return
          }
          // Fallback: if no starts_at, check if end times match (backwards compatibility)
          else if (!existingStart && existingEnd.getTime() === newBookingEnd.getTime()) {
            alert('Dette tidsrum er allerede optaget!')
            setShowConfirmDialog(false)
            return
          }
        }
      }
      
      console.log('Creating booking with starts_at:', startsAt, 'ends_at:', endsAt)
      console.log('Selected date:', selectedDate)
      console.log('Selected time slot:', selectedTimeSlot)

      const bookingData = {
        room_id: selectedRoom,
        starts_at: startsAt, // Add starts_at for overlap detection (column needs to exist in DB)
        ends_at: endsAt,
        participation_: participants.length,
        booked_by: userRole === 'admin' ? '1' : '0',
        participants: JSON.stringify(participants),
        room_type: roomType // 'mødelokale' or 'undervisningslokale'
      }

      const { data, error } = await supabase
        .from('session-table') 
        .insert([bookingData])
        .select()

      if (error) {
        console.error('Error creating booking:', error)
        alert(`Fejl ved oprettelse af booking: ${error.message}`)
        setShowConfirmDialog(false)
        return
      }

      console.log('Booking created successfully:', data)
      setShowConfirmDialog(false)
      setShowSuccessDialog(true)
      
      // Trigger refresh of bookings
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Unexpected error:', error)
      alert(`Uventet fejl: ${error.message}`)
      setShowConfirmDialog(false)
    }
  }

  // Viser delete-dialog når admin klikker på et optaget tidsrum
  const handleRequestDeleteBooking = (slot) => {
    if (!selectedRoom) return
    setDeleteTargetSlot(slot)
    setShowDeleteDialog(true)
  }

  // Sletter bookingen i databasen og viser succesdialog
  const handleDeleteBooking = async () => {
    const slot = deleteTargetSlot
    if (!selectedRoom) return
    if (!slot) return
    try {
      const endsAt = calculateEndTime(selectedDate, slot)
      const { error } = await supabase
        .from('session-table')
        .delete()
        .eq('room_id', selectedRoom)
        .eq('ends_at', endsAt)

      if (error) {
        throw error
      }

      setDeleteTargetSlot(null)
      setShowDeleteDialog(false)
      setShowDeleteSuccessDialog(true)
      
      // Trigger refresh of bookings
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Error deleting booking:', error)
      // Ingen bruger-fejlmeddelelse; kun log i konsollen
    }
  }

  const removeParticipant = (email) => {
    setParticipants(participants.filter(p => p !== email))
  }

  // Eksporterer state/konstanter/handlers til UI-lag
  return {
    state: {
      selectedDate,
      currentMonth,
      selectedFloor,
      selectedRoom,
      selectedTimeSlot,
      participantEmail,
      participants,
      validationErrors,
      hasAttemptedBooking,
      bookedTimeSlots,
      userRole,
      showConfirmDialog,
      showSuccessDialog,
      showDeleteDialog,
      showDeleteSuccessDialog,
      deleteTargetSlot
    },
    constants: {
      floors: FLOORS,
      rooms: ROOMS,
      timeSlots,
      roomType
    },
    actions: {
      setSelectedDate,
      setCurrentMonth,
      setParticipantEmail,
      setShowConfirmDialog,
      setShowSuccessDialog,
      setShowDeleteDialog,
      setShowDeleteSuccessDialog,
      setDeleteTargetSlot,
      setUserRole,
      handleMonthChange,
      handleRoomToggle,
      handleFloorChange,
      handleAddParticipant,
      handleTimeSlotSelect,
      handleBook,
      handleConfirmBooking,
      handleRequestDeleteBooking,
      handleDeleteBooking,
      removeParticipant
    },
    helpers: {
      formatDateForPreview
    }
  }
}

