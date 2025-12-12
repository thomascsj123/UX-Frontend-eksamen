import PropTypes from 'prop-types'
import Link from 'next/link'

// Simpelt layout for logo og breadcrumb
// Logoet fører tilbage til dashboard
export default function BookingHeader({ userRole, onRoleChange, breadcrumbText = 'Dashboard / Book mødelokale' }) {
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo med link til dashboard */}
        <div className="logo-container">
          <Link href="/dashboard-page">
            <img src="/timeann.png" alt="TimeAnn Logo" className="logo-image" />
          </Link>
        </div>
        {/* Breadcrumb navigation */}
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

