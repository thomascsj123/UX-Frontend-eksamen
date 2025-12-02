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

// Samler al booking-state, datofetch og Supabase sideeffekter ét sted
export function useBookingController(options = {}) {
  const timeSlots = options.timeSlots ?? DEFAULT_TIME_SLOTS
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

  // Overvåger ændringer i dato/lokale og henter bookinger fra Supabase
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedDate || !selectedRoom) {
        setBookedTimeSlots([])
        return
      }

      try {
        const startOfDay = new Date(selectedDate)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(selectedDate)
        endOfDay.setHours(23, 59, 59, 999)

        const { data, error } = await supabase
          .from('session-table')
          .select('ends_at')
          .eq('room_id', selectedRoom)
          .gte('ends_at', startOfDay.toISOString())
          .lte('ends_at', endOfDay.toISOString())

        if (error) {
          console.error('Error fetching bookings:', error)
          return
        }

        const booked = []
        if (data) {
          const selectedDateStr = selectedDate.toDateString()
          const nextDate = new Date(selectedDate)
          nextDate.setDate(nextDate.getDate() + 1)
          const nextDateStr = nextDate.toDateString()

          data.forEach(booking => {
            const endTime = new Date(booking.ends_at)
            const bookingDateStr = endTime.toDateString()
            const isSameDay = bookingDateStr === selectedDateStr
            const isNextDay = bookingDateStr === nextDateStr

            if (isSameDay || isNextDay) {
              const endHour = endTime.getHours()
              const endMinute = endTime.getMinutes()

              timeSlots.forEach(slot => {
                const [start, end] = slot.split('-')
                const [startHour, startMinute] = start.split(':').map(Number)
                const [endHourStr, endMinuteStr] = end.split(':')
                const slotEndHour = parseInt(endHourStr, 10)
                const slotEndMinute = parseInt(endMinuteStr, 10)
                const crossesMidnight =
                  slotEndHour < startHour ||
                  (slotEndHour === startHour && slotEndMinute < startMinute)
                const matchesEnd = endHour === slotEndHour && endMinute === slotEndMinute

                if ((isSameDay && matchesEnd && !crossesMidnight) ||
                    (isNextDay && matchesEnd && crossesMidnight)) {
                  booked.push(slot)
                }
              })
            }
          })
        }

        setBookedTimeSlots(booked)
      } catch (error) {
        console.error('Unexpected error fetching bookings:', error)
      }
    }

    fetchBookings()
  }, [selectedDate, selectedRoom, timeSlots])

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
        setShowConfirmDialog(false)
        return
      }

      const endsAt = calculateEndTime(selectedDate, selectedTimeSlot)

      const bookingData = {
        room_id: selectedRoom,
        ends_at: endsAt,
        participation_: participants.length,
        booked_by: userRole === 'admin' ? 1 : 0,
        participants: participants 
      }

      const { data } = await supabase
        .from('session-table') 
        .insert([bookingData])
        .select()

      if (!bookedTimeSlots.includes(selectedTimeSlot)) {
        setBookedTimeSlots(prev => [...prev, selectedTimeSlot])
      }

      setShowConfirmDialog(false)
      setShowSuccessDialog(true)
      console.log('Booking created successfully:', data)
    } catch (error) {
      console.error('Unexpected error:', error)
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

      setBookedTimeSlots(prev => prev.filter(s => s !== slot))
      setDeleteTargetSlot(null)
      setShowDeleteDialog(false)
      setShowDeleteSuccessDialog(true)
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
      timeSlots
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

