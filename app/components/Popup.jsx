export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose} // klik udenfor lukker modalen
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // klik *inde* lukker ikke
      >
        {children}
      </div>
    </div>
  );
}
