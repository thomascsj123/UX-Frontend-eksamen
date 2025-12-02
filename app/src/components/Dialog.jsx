import PropTypes from 'prop-types'

// Genbrugelig modal med knapper der føres ind som prop
export default function Dialog({ isOpen, message, buttons, onClose }) {
  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '90%'
        }}
      >
        <p style={{ fontSize: '1rem', color: '#374151', marginBottom: '1.5rem', textAlign: 'center' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: '#25262B',
                borderRadius: '20px'
              }}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

Dialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  })).isRequired,
  onClose: PropTypes.func.isRequired
}

