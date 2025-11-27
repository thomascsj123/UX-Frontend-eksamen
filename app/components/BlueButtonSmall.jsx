export default function BlueButtonSmall({ label, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        backgroundColor: "#1B406F",
        width: "100px",
        height: "40px",
        color: "white",
        borderRadius: "25px",
        cursor: "pointer",
        border: "none",
        fontSize: "15px"
      }}
    >
      {label}
    </button>
  );
}
