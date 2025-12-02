import PropTypes from 'prop-types'

// Viser et lille resumé af den aktuelle booking med fejlstatus
export default function BookingPreview({ selectedDate, selectedRoom, selectedTimeSlot, participants, hasValidationErrors }) {
  // Formaterer datoen til dansk
  const formatDateForPreview = (date) => {
    const dayName = date.toLocaleDateString('da-DK', { weekday: 'long' })
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${dayName} d. ${day}/${month}/${year}`
  }

  return (
    // Container for bookingforhåndsvisningen
    <div style={{ 
      flex: 1, 
      maxWidth: '900px', 
      backgroundColor: '#95A6B7', 
      borderRadius: '6px', 
      padding: '1rem' 
    }}>
      <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
        Booking preview
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
          <span style={{ fontWeight: 500, color: '#374151' }}>Dato:</span>
          <span style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #000000', 
            padding: '0.5rem', 
            color: '#000000', 
            borderRadius: '2px' 
          }}>
            {formatDateForPreview(selectedDate)}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
          <span style={{ fontWeight: 500, color: '#374151' }}>Lokale:</span>
          <span style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #000000', 
            padding: '0.5rem', 
            color: '#000000', 
            borderRadius: '2px' 
          }}>
            {selectedRoom || 'Ikke valgt'}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
          <span style={{ fontWeight: 500, color: '#374151' }}>Tidsrum:</span>
          <span style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #000000', 
            padding: '0.5rem', 
            color: '#000000', 
            borderRadius: '2px' 
          }}>
            {selectedTimeSlot || 'Ikke valgt'}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
          <span style={{ fontWeight: 500, color: '#374151' }}>Deltagere:</span>
          <span style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #000000', 
            padding: '0.5rem', 
            color: '#000000', 
            borderRadius: '2px' 
          }}>
            {participants.length > 0 ? participants.join(', ') : 'Ingen'}
          </span>
        </div>
      </div>
      {/* Viser fejlbesked hvis der mangler påkrævede felter */}
      {hasValidationErrors && (
        <div style={{ 
          color: '#dc2626', 
          fontSize: '0.875rem', 
          marginTop: '1rem', 
          padding: '0.5rem', 
          backgroundColor: '#fee2e2', 
          borderRadius: '4px', 
          border: '1px solid #dc2626' 
        }}>
          Der mangler udfyldte felter. Udfyld venligst de felter, der er markeret med rødt, før du kan fortsætte med bookingen.
        </div>
      )}
    </div>
  )
}

BookingPreview.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  selectedRoom: PropTypes.string,
  selectedTimeSlot: PropTypes.string,
  participants: PropTypes.arrayOf(PropTypes.string).isRequired,
  hasValidationErrors: PropTypes.bool.isRequired
}

