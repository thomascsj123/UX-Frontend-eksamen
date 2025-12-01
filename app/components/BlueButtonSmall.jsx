export default function BlueButtonSmall({
  label,
  onClick,
  className = "",
  width = "100px",
  height = "40px",
}) {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        backgroundColor: "#1B406F",
        width,
        height,
        color: "white",
        borderRadius: "25px",
        cursor: "pointer",
        border: "none",
        fontSize: "15px",
      }}
    >
      {label}
    </button>
  );
}
