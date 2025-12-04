'use client'

// Sidekomponent der binder layout, sektioner og dialoger sammen
import PropTypes from 'prop-types'
import BookingHeader from '../layouts/BookingHeader'
import Calendar from '../components/Calendar'
import RoomSelector from '../components/RoomSelector'
import TimeSlotSelector from '../components/TimeSlotSelector'
import ParticipantsSection from '../components/ParticipantsSection'
import BookingPreview from '../components/BookingPreview'
import Dialog from '../components/Dialog'
import { useBookingController } from '../hooks/useBookingController'

export default function BookingPage({
  pageTitle = 'Book Undervisningslokale',
  breadcrumbText = 'Dashboard / Book undervisningslokale',
  hookOptions,
  timeSlotColumns = 2
}) {
  const { state, actions, constants, helpers } = useBookingController(hookOptions)
  const {
    selectedDate,
    currentMonth,
    selectedFloor,
    selectedRoom,
    selectedTimeSlot,
    participantEmail,
    participants,
    validationErrors,
    hasAttemptedBooking,
    bookedTimeSlots,
    userRole,
    showConfirmDialog,
    showSuccessDialog,
    showDeleteDialog,
    showDeleteSuccessDialog,
    deleteTargetSlot
  } = state

  const {
    setSelectedDate,
    setParticipantEmail,
    setShowConfirmDialog,
    setShowSuccessDialog,
    setShowDeleteDialog,
    setShowDeleteSuccessDialog,
    setDeleteTargetSlot,
    setUserRole,
    handleMonthChange,
    handleRoomToggle,
    handleFloorChange,
    handleAddParticipant,
    handleTimeSlotSelect,
    handleBook,
    handleConfirmBooking,
    handleRequestDeleteBooking,
    handleDeleteBooking,
    removeParticipant
  } = actions

  const { floors, rooms, timeSlots, roomType } = constants
  const { formatDateForPreview } = helpers

  // UI-struktur: header, inputs, preview og dialoger
  return (
    <div className="app">
      <BookingHeader
        userRole={userRole}
        onRoleChange={setUserRole}
        breadcrumbText={breadcrumbText}
      />

      <main className="main-content">
        <h1 className="page-title">{pageTitle}</h1>

        <div className="booking-container">
          <div className="booking-section">
            <div className="calendar-card">
              <h2 className="section-title">Vælg dato*</h2>
              <Calendar
                selectedDate={selectedDate}
                currentMonth={currentMonth}
                onDateClick={setSelectedDate}
                onMonthChange={handleMonthChange}
              />
            </div>
          </div>

          <div className="booking-section">
            <RoomSelector
              floors={floors}
              rooms={rooms}
              selectedFloor={selectedFloor}
              selectedRoom={selectedRoom}
              onFloorChange={handleFloorChange}
              onRoomToggle={handleRoomToggle}
              hasError={validationErrors.room}
            />
          </div>

          <div className="booking-section">
            <TimeSlotSelector
              timeSlots={timeSlots}
              selectedTimeSlot={selectedTimeSlot}
              onTimeSlotSelect={handleTimeSlotSelect}
              hasError={validationErrors.timeSlot}
              bookedTimeSlots={bookedTimeSlots}
              userRole={userRole}
              onAdminDeleteBooking={handleRequestDeleteBooking}
              columns={timeSlotColumns}
            />
            <ParticipantsSection
              participantEmail={participantEmail}
              participants={participants}
              onEmailChange={setParticipantEmail}
              onAddParticipant={handleAddParticipant}
              onRemoveParticipant={removeParticipant}
            />
          </div>
        </div>

        <div className="bottom-section">
          <BookingPreview
            selectedDate={selectedDate}
            selectedRoom={selectedRoom}
            selectedTimeSlot={selectedTimeSlot}
            participants={participants}
            roomType={roomType}
            hasValidationErrors={hasAttemptedBooking && Object.keys(validationErrors).length > 0}
          />
          <div className="book-button-container">
            <button className="book-button" onClick={handleBook}>Book</button>
          </div>
        </div>
      </main>

      <Dialog
        isOpen={showConfirmDialog}
        message={`Bekræft venligst din bookning af ${selectedRoom}, ${formatDateForPreview(selectedDate)} kl. ${selectedTimeSlot}`}
        buttons={[
          { label: 'Annuller', onClick: () => setShowConfirmDialog(false) },
          { label: 'Bekræft', onClick: handleConfirmBooking }
        ]}
        onClose={() => setShowConfirmDialog(false)}
      />

      <Dialog
        isOpen={showSuccessDialog}
        message="Din bookning blev gennemført!"
        buttons={[
          { label: 'Se alle bookninger', onClick: () => setShowSuccessDialog(false) },
          { label: 'Tilbage til dashboard', onClick: () => setShowSuccessDialog(false) }
        ]}
        onClose={() => setShowSuccessDialog(false)}
      />

      <Dialog
        isOpen={showDeleteDialog}
        message={`Bekræft venligst sletning booking af ${selectedRoom}, ${formatDateForPreview(selectedDate)} fra ${deleteTargetSlot}`}
        buttons={[
          { label: 'Annuller', onClick: () => { setShowDeleteDialog(false); setDeleteTargetSlot(null) } },
          { label: 'Bekræft', onClick: handleDeleteBooking }
        ]}
        onClose={() => { setShowDeleteDialog(false); setDeleteTargetSlot(null) }}
      />

      <Dialog
        isOpen={showDeleteSuccessDialog}
        message="Bookningen er blevet slettet"
        buttons={[
          { label: 'Tilbage til book', onClick: () => setShowDeleteSuccessDialog(false) },
          { label: 'Tilbage til dashboard', onClick: () => setShowDeleteSuccessDialog(false) }
        ]}
        onClose={() => setShowDeleteSuccessDialog(false)}
      />
    </div>
  )
}

BookingPage.propTypes = {
  pageTitle: PropTypes.string,
  breadcrumbText: PropTypes.string,
  hookOptions: PropTypes.shape({
    timeSlots: PropTypes.arrayOf(PropTypes.string),
    roomType: PropTypes.oneOf(['mødelokale', 'undervisningslokale'])
  }),
  timeSlotColumns: PropTypes.number
}

