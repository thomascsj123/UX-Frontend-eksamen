import PropTypes from 'prop-types'

// Simpel formular til tilføjelse/fjernelse af deltagere
export default function ParticipantsSection({ participantEmail, participants, onEmailChange, onAddParticipant, onRemoveParticipant, onBook }) {
  return (
    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
      <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
        Tilføj deltagere
      </h2>
      {/* Formular til tilføjelse af deltagere */}
      <form onSubmit={onAddParticipant} style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
          <input
            type="email"
            placeholder="Indtast deltagers e-mailadresse"
            value={participantEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.75rem',
              color: '#374151'
            }}
            onFocus={(e) => {
              e.target.style.outline = '1px solid #1e40af'
              e.target.style.borderColor = '#1e40af'
            }}
            onBlur={(e) => {
              e.target.style.outline = 'none'
              e.target.style.borderColor = '#d1d5db'
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#1e40af',
              color: '#ffffff',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
            }}
          >
            Tilføj
          </button>
        </div>
      </form>
      {/* Liste over tilføjede deltagere */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1.5rem' }}>
        {participants.map((email, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0.375rem 0.5rem', 
            backgroundColor: '#f9fafb', 
          }}>
            <span style={{ color: '#374151' }}>{email}</span>
            <button
              onClick={() => onRemoveParticipant(email)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: 0,
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {/* Book-knap placeret nederst for ikke at stå i vejen */}
      {onBook && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={onBook}
            style={{
              backgroundColor: '#1B406F',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 2.5rem',
              fontSize: '1.25rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderRadius: '5px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1e3a8a'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1B406F'
            }}
          >
            Book
          </button>
        </div>
      )}
    </div>
  )
}

ParticipantsSection.propTypes = {
  participantEmail: PropTypes.string.isRequired,
  participants: PropTypes.arrayOf(PropTypes.string).isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onAddParticipant: PropTypes.func.isRequired,
  onRemoveParticipant: PropTypes.func.isRequired,
  onBook: PropTypes.func
}

