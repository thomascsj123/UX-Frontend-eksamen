import PropTypes from 'prop-types'

// Simpelt layout for logo, rollevalg og breadcrumb
export default function BookingHeader({ userRole, onRoleChange, breadcrumbText = 'Dashboard / Book mødelokale' }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <img src="/timeann.png" alt="TimeAnn Logo" className="logo-image" />
          <div className="role-selector">
            <button
              onClick={() => onRoleChange('studerende')}
              className={`role-button ${userRole === 'studerende' ? 'active' : ''}`}
            >
              Studerende
            </button>
            <button
              onClick={() => onRoleChange('admin')}
              className={`role-button ${userRole === 'admin' ? 'active' : ''}`}
            >
              Admin
            </button>
          </div>
        </div>
        <div className="breadcrumb">{breadcrumbText}</div>
      </div>
    </header>
  )
}

BookingHeader.propTypes = {
  userRole: PropTypes.string.isRequired,
  onRoleChange: PropTypes.func.isRequired,
  breadcrumbText: PropTypes.string
}

