import PropTypes from 'prop-types'

// Komponent til at vise kalender og vælge dato
export default function Calendar({ selectedDate, currentMonth, onDateClick, onMonthChange }) {
  // Beregner alle dage i den valgte måned inkl. tomme pladser for ugedage før månedens start
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const startingDayOfWeek = firstDay.getDay()
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    return days
  }

  // Tjekker om to datoer er samme dag
  const isSameDay = (date1, date2) => {
    return date1 && date2 &&
           date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const isPastDate = (date) => {
    if (!date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const check = new Date(date)
    check.setHours(0, 0, 0, 0)
    return check < today
  }

  // Henter månedens navn på dansk
  const getMonthName = (date) => {
    return date.toLocaleDateString('da-DK', { month: 'long' })
  }

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const days = getDaysInMonth(currentMonth)

  const navButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem'
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <button onClick={() => onMonthChange(-1)} style={navButtonStyle}>‹</button>
        <span style={{ fontWeight: 'bold', color: '#374151', fontSize: '0.875rem' }}>
          {getMonthName(currentMonth)} {currentMonth.getFullYear()}
        </span>
        <button onClick={() => onMonthChange(1)} style={navButtonStyle}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.125rem', marginBottom: '1rem' }}>
        {dayNames.map(day => (
          <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6b7280', padding: '0.25rem' }}>
            {day}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.125rem' }}>
        {days.map((date, index) => {
          const isPast = isPastDate(date)
          const isSelected = isSameDay(date, selectedDate)
          
          return (
            <button
              key={index}
              onClick={() => date && !isPast && onDateClick(date)}
              disabled={!date || isPast}
              style={{
                aspectRatio: 1,
                border: 'none',
                backgroundColor: isSelected ? '#d1d5db' : date ? '#ffffff' : 'transparent',
                fontSize: '0.75rem',
                cursor: date && !isPast ? 'pointer' : 'default',
                color: isPast ? '#9ca3af' : '#000000',
                opacity: isPast ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (date && !isPast && !isSelected) e.target.style.backgroundColor = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                if (date && !isPast && !isSelected) e.target.style.backgroundColor = '#ffffff'
              }}
            >
              {date?.getDate() || ''}
            </button>
          )
        })}
      </div>
    </div>
  )
}

Calendar.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  currentMonth: PropTypes.instanceOf(Date).isRequired,
  onDateClick: PropTypes.func.isRequired,
  onMonthChange: PropTypes.func.isRequired
}

