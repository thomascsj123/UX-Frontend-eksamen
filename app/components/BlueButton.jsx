export default function BlueButton({ label, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        backgroundColor: "#1B406F",
        width: "200px",
        height: "50px",
        color: "white",
        borderRadius: "25px",
        cursor: "pointer",
        border: "none",
        
      }}
    >
      {label}
    </button>
  );
}
