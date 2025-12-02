import PropTypes from 'prop-types'

// Håndterer valg af etage og markerer det valgte lokale
export default function RoomSelector({ floors, rooms, selectedFloor, selectedRoom, onFloorChange, onRoomToggle, hasError }) {
  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ 
        fontSize: '0.875rem', 
        fontWeight: 600, 
        color: hasError ? '#dc2626' : '#374151', 
        marginBottom: '0.75rem' 
      }}>
        Vælg lokale*
      </h2>
      <div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {floors.map(floor => (
            <button
              key={floor}
              onClick={() => onFloorChange(floor)}
              style={{
                backgroundColor: selectedFloor === floor ? '#d1d5db' : '#ffffff',
                border: '1px solid #000000',
                padding: '0.8rem 1.2rem',
                fontSize: '0.75rem',
                color: '#000000',
                cursor: 'pointer',
                fontWeight: selectedFloor === floor ? 500 : 400
              }}
            >
              {floor}
            </button>
          ))}
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          backgroundColor: '#d1d5db',
          padding: '0.75rem',
          borderRadius: '4px'
        }}>
          {rooms[selectedFloor].map(room => (
            <div key={room} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: '#ffffff', 
              padding: '0.5rem', 
              borderRadius: '4px' 
            }}>
              <label style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedRoom === room}
                  onChange={() => onRoomToggle(room)}
                  style={{ position: 'absolute', opacity: 0, cursor: 'pointer' }}
                />
                <span style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '18px',
                  border: selectedRoom === room ? '1px solid #1e40af' : '1px solid #9ca3af',
                  backgroundColor: '#ffffff',
                  textAlign: 'center',
                  lineHeight: '16px',
                  fontSize: '12px',
                  color: '#1e40af',
                  fontWeight: 'bold'
                }}>
                  {selectedRoom === room ? 'X' : ''}
                </span>
              </label>
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>{room}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

RoomSelector.propTypes = {
  floors: PropTypes.arrayOf(PropTypes.string).isRequired,
  rooms: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  selectedFloor: PropTypes.string.isRequired,
  selectedRoom: PropTypes.string,
  onFloorChange: PropTypes.func.isRequired,
  onRoomToggle: PropTypes.func.isRequired,
  hasError: PropTypes.bool
}

