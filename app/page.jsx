'use client'

import { useState } from 'react'
import BookingPage from './pages/BookingPage'
import TeachingBookingPage from './pages/TeachingBookingPage'
import './App.css'

export default function Home() {
  const [activePage, setActivePage] = useState('meeting')

  return (
    <>
      <div className="page-switcher">
        <button
          className={`switcher-button ${activePage === 'meeting' ? 'active' : ''}`}
          onClick={() => setActivePage('meeting')}
        >
          Book undervisningslokale
        </button>
        <button
          className={`switcher-button ${activePage === 'teaching' ? 'active' : ''}`}
          onClick={() => setActivePage('teaching')}
        >
          Book mødelokale
        </button>
      </div>
      {activePage === 'meeting' ? <BookingPage /> : <TeachingBookingPage />}
    </>
  )
}

