export default function Modal({
  open,
  onClose,
  children,
  className = "",
  overlayClassName = ""
}) {
  if (!open) return null;

  return (
    <div
      className={`modal-overlay ${overlayClassName}`}
      onClick={onClose}
    >
      <div
        className={`modal-content ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
