import PropTypes from 'prop-types'

// Viser tidsrum og giver admin genvej til at slette optagede slots
export default function TimeSlotSelector({
  timeSlots,
  selectedTimeSlot,
  onTimeSlotSelect,
  hasError,
  bookedTimeSlots = [],
  userRole = 'studerende',
  onAdminDeleteBooking,
  columns = 2
}) {
  const isAdmin = userRole === 'admin'
  
  return (
    <div>
      <h2 style={{ 
        fontSize: '0.875rem',
        fontWeight: 600,
        color: hasError ? '#dc2626' : '#374151',
        marginBottom: '0.75rem'
      }}>
        Vælg tidsrum*
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        {timeSlots.map(slot => {
          const isSelected = selectedTimeSlot === slot
          const isBooked = bookedTimeSlots.includes(slot)
          
          const handleClick = () => {
            if (isBooked) {
              if (isAdmin) {
                onAdminDeleteBooking?.(slot)
              }
              return
            }
            onTimeSlotSelect(slot)
          }

          return (
            <button
              key={slot}
              onClick={handleClick}
              disabled={isBooked && !isAdmin}
              style={{
                padding: '0.5rem 0.75rem',
                border: isSelected ? '4px solid black' : isBooked ? '1px solid #dc2626' : '1px solid #d1d5db',
                backgroundColor: isBooked ? '#fee2e2' : isSelected ? '#ffffff' : '#f9fafb',
                color: isBooked ? '#dc2626' : '#374151',
                fontSize: '0.75rem',
                cursor: isBooked ? (isAdmin ? 'pointer' : 'not-allowed') : 'pointer',
                textAlign: 'center',
                fontWeight: isSelected ? 500 : 400,
                transition: 'background-color 0.15s',
                opacity: isBooked && !isAdmin ? 0.7 : 1
              }}
              title={isBooked ? (isAdmin ? 'Klik for at slette bookingen' : 'Tidsrummet er optaget') : undefined}
              onMouseEnter={(e) => {
                if (!isSelected && !isBooked) {
                  e.currentTarget.style.backgroundColor = '#e5e7eb'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected && !isBooked) {
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                }
              }}
            >
              {slot} {isBooked && '(Optaget)'}
            </button>
          )
        })}
      </div>
    </div>
  )
}

TimeSlotSelector.propTypes = {
  timeSlots: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTimeSlot: PropTypes.string,
  onTimeSlotSelect: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  bookedTimeSlots: PropTypes.arrayOf(PropTypes.string),
  userRole: PropTypes.string,
  onAdminDeleteBooking: PropTypes.func,
  columns: PropTypes.number
}

