import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Statisk opsætning af etager, lokaler og tidsrum
const FLOORS = ['1 sal', '2 sal', '3 sal', '4 sal']
const ROOMS = {
  '1 sal': ['1.10', '1.11', '1.12', '1.13', '1.14', '1.15', '1.16', ],
  '2 sal': ['2.10', '2.11', '2.12', '2.13', '2.14', '2.15', '2.16', ],
  '3 sal': ['3.10', '3.11', '3.12', '3.13', '3.14', '3.15', '3.16', ],
  '4 sal': ['4.10', '4.11', '4.12', '4.13', '4.14', '4.15', '4.16', ]
}

const DEFAULT_TIME_SLOTS = [
  '08:00-09:15', '09:30-10:45', '11:00-12:15', '12:30-13:45',
  '15:30-16:45', '17:00-18:15', '18:30-19:45', '20:00-21:15', '23:00-00:15'
]

// Samler al booking-state, datofetch og Supabase sideeffekter i et sted
// Hovedhook der håndterer al booking-logik
export function useBookingController(options = {}) {
  const timeSlots = options.timeSlots ?? DEFAULT_TIME_SLOTS
  const roomType = options.roomType ?? 'undervisningslokale' // Standard er undervisningslokale
  const enableDateRange = roomType === 'undervisningslokale' // Dato-range kun for undervisningslokaler
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedEndDate, setSelectedEndDate] = useState(null)
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

  // Tjekker om to tidsperioder overlapper hinanden
  const doTimeRangesOverlap = (start1, end1, start2, end2) => {
    // To perioder overlapper hvis: start1 < end2 OG start2 < end1
    return start1 < end2 && start2 < end1
  }

  // Hjælpefunktion til at få alle datoer i range
  // Skal være defineret før useEffect der bruger den
  const getDatesInRange = () => {
    if (!selectedDate) return []
    if (!enableDateRange || !selectedEndDate) return [selectedDate]
    
    const dates = []
    const start = new Date(selectedDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(selectedEndDate)
    end.setHours(0, 0, 0, 0)
    
    const current = new Date(start)
    while (current <= end) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return dates
  }

  // Overvåger ændringer i dato/lokale og henter bookinger fra Supabase
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedDate || !selectedRoom) {
        setBookedTimeSlots([])
        return
      }

      try {
        const datesToCheck = getDatesInRange()
        if (datesToCheck.length === 0) {
          setBookedTimeSlots([])
          return
        }

        // Find første og sidste dato i range
        const firstDate = datesToCheck[0]
        const lastDate = datesToCheck[datesToCheck.length - 1]
        
        // Query a wider range to catch bookings that might end on the next day
        const startOfDay = new Date(firstDate)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfNextDay = new Date(lastDate)
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

            // For each date in range and each time slot, check if it overlaps with this booking
            datesToCheck.forEach(checkDate => {
              timeSlots.forEach(slot => {
                const [startStr, endStr] = slot.split('-')
                const [startHour, startMinute] = startStr.split(':').map(Number)
                const [endHour, endMinute] = endStr.split(':').map(Number)
                
                // Calculate time slot start and end times for this date
                const slotStart = new Date(checkDate)
                slotStart.setHours(startHour, startMinute, 0, 0)
                
                const slotEnd = new Date(checkDate)
                const crossesMidnight = endHour < startHour || (endHour === startHour && endMinute < startMinute)
                if (crossesMidnight) {
                  slotEnd.setDate(slotEnd.getDate() + 1)
                }
                slotEnd.setHours(endHour, endMinute, 0, 0)

                // Check if booking overlaps with this time slot
                if (doTimeRangesOverlap(bookingStart, bookingEnd, slotStart, slotEnd)) {
                  bookedSet.add(slot)
                  console.log(`✓ Slot ${slot} on ${checkDate.toISOString()} overlaps with booking (${bookingStart.toISOString()} - ${bookingEnd.toISOString()})`)
                }
              })
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
  }, [selectedDate, selectedEndDate, selectedRoom, timeSlots, refreshTrigger])

  const handleMonthChange = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1))
  }

  // Håndterer dato-klik med range support
  const handleDateClick = (date) => {
    if (!enableDateRange) {
      setSelectedDate(date)
      setSelectedEndDate(null)
      return
    }

    // Hvis der ikke er nogen startdato, eller hvis den nye dato er før startdatoen, sæt den som ny startdato
    if (!selectedDate || date < selectedDate) {
      setSelectedDate(date)
      setSelectedEndDate(null)
      return
    }

    // Hvis der allerede er en startdato, sæt slutdatoen
    if (selectedDate && !selectedEndDate) {
      setSelectedEndDate(date)
      return
    }

    // Hvis der allerede er både start og slut, start forfra
    if (selectedDate && selectedEndDate) {
      setSelectedDate(date)
      setSelectedEndDate(null)
    }
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
  // selectedEndDate er valgfrit - man kan booke én dag eller flere dage
  const handleBook = () => {
    setHasAttemptedBooking(true)
    const errors = {}
    if (!selectedRoom) errors.room = true
    if (!selectedTimeSlot) errors.timeSlot = true
    // Note: selectedEndDate er valgfrit - man kan booke én dag eller flere dage

    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return
    // Hvis tidsrummet allerede er optaget, gør vi bare ingenting 
    if (bookedTimeSlots.includes(selectedTimeSlot)) return

    setShowConfirmDialog(true)
  }

  // Sender booking til Supabase og opdaterer lokal state
  // Håndterer både enkeltdato og dato-range bookinger
  const handleConfirmBooking = async () => {
    try {
      if (bookedTimeSlots.includes(selectedTimeSlot)) {
        alert('Dette tidsrum er allerede optaget!')
        setShowConfirmDialog(false)
        return
      }

      const datesToBook = getDatesInRange()
      if (datesToBook.length === 0) {
        alert('Ingen datoer valgt!')
        setShowConfirmDialog(false)
        return
      }

      // Tjek for overlappende bookinger for alle datoer i range
      const firstDate = datesToBook[0]
      const lastDate = datesToBook[datesToBook.length - 1]
      const startOfDay = new Date(firstDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfNextDay = new Date(lastDate)
      endOfNextDay.setDate(endOfNextDay.getDate() + 1)
      endOfNextDay.setHours(23, 59, 59, 999)
      
      // Hent eksisterende bookinger fra Supabase
      const { data: existingBookings } = await supabase
        .from('session-table')
        .select('starts_at, ends_at')
        .eq('room_id', selectedRoom)
        .gte('ends_at', startOfDay.toISOString())
        .lte('ends_at', endOfNextDay.toISOString())
      
      // Tjek hver dato for overlappende bookinger
      const [start, end] = selectedTimeSlot.split('-')
      const [startHour, startMinute] = start.split(':').map(Number)
      
      for (const date of datesToBook) {
        const endsAt = calculateEndTime(date, selectedTimeSlot)
        const startDate = new Date(date)
        startDate.setHours(startHour, startMinute, 0, 0)
        const startsAt = startDate.toISOString()
        
        const newBookingStart = new Date(startsAt)
        const newBookingEnd = new Date(endsAt)
        
        if (existingBookings) {
          for (const existing of existingBookings) {
            const existingStart = existing.starts_at ? new Date(existing.starts_at) : null
            const existingEnd = new Date(existing.ends_at)
            
            // Hvis starts_at eksisterer, tjek for overlap
            if (existingStart && doTimeRangesOverlap(newBookingStart, newBookingEnd, existingStart, existingEnd)) {
              alert(`Denne booking overlapper med en eksisterende booking på ${formatDateForPreview(date)}!`)
              setShowConfirmDialog(false)
              return
            }
            // Fallback: Hvis ingen starts_at, tjek om sluttider matcher (bagudkompatibilitet)
            else if (!existingStart && existingEnd.getTime() === newBookingEnd.getTime()) {
              alert(`Dette tidsrum er allerede optaget på ${formatDateForPreview(date)}!`)
              setShowConfirmDialog(false)
              return
            }
          }
        }
      }
      
      // Opret bookinger for alle datoer i range
      const bookingDataArray = datesToBook.map(date => {
        const endsAt = calculateEndTime(date, selectedTimeSlot)
        const startDate = new Date(date)
        startDate.setHours(startHour, startMinute, 0, 0)
        const startsAt = startDate.toISOString()
        
        return {
          room_id: selectedRoom,
          starts_at: startsAt,
          ends_at: endsAt,
          participation_: participants.length,
          booked_by: userRole === 'admin' ? '1' : '0',
          participants: JSON.stringify(participants),
          room_type: roomType
        }
      })

      console.log('Creating bookings for dates:', datesToBook.map(d => formatDateForPreview(d)))
      console.log('Selected time slot:', selectedTimeSlot)

      const { data, error } = await supabase
        .from('session-table') 
        .insert(bookingDataArray)
        .select()

      if (error) {
        console.error('Error creating bookings:', error)
        alert(`Fejl ved oprettelse af bookinger: ${error.message}`)
        setShowConfirmDialog(false)
        return
      }

      console.log('Bookings created successfully:', data)
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
      selectedEndDate,
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
      deleteTargetSlot,
      enableDateRange
    },
    constants: {
      floors: FLOORS,
      rooms: ROOMS,
      timeSlots,
      roomType
    },
    actions: {
      setSelectedDate,
      setSelectedEndDate,
      setCurrentMonth,
      setParticipantEmail,
      setShowConfirmDialog,
      setShowSuccessDialog,
      setShowDeleteDialog,
      setShowDeleteSuccessDialog,
      setDeleteTargetSlot,
      setUserRole,
      handleMonthChange,
      handleDateClick,
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
      formatDateForPreview,
      getDatesInRange
    }
  }
}

