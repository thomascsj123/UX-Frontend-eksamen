'use client'

import BookingPage from '../page.jsx'

// Teaching booking page component
const HALF_HOUR_SLOTS = createHalfHourSlots()
const TEACHING_HOOK_OPTIONS = { 
  timeSlots: HALF_HOUR_SLOTS,
  roomType: 'mødelokale' // This page is for meeting rooms
}

export default function TeachingBookingPage() {
  return (
    <BookingPage
      pageTitle="Book mødelokale"
      breadcrumbText="Dashboard / Book mødelokale"
      hookOptions={TEACHING_HOOK_OPTIONS}
      timeSlotColumns={3}
    />
  )
}

function createHalfHourSlots(startHour = 8, endHour = 24) {
  const slots = []
  const minutesPerDay = 24 * 60
  for (let minutes = startHour * 60; minutes < endHour * 60; minutes += 30) {
    const start = formatMinutes(minutes)
    const end = formatMinutes((minutes + 30) % minutesPerDay)
    slots.push(`${start}-${end}`)
  }
  return slots
}

function formatMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

