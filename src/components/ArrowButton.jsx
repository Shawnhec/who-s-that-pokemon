import arrow from "../assets/arrow.png";

function ArrowButton({ direction, disabled, onClick }) {
  return (
    <img
      className={`button arrow arrow-${direction} ${disabled ? "is-end" : ""}`}
      src={arrow}
      alt={direction === "left" ? "Previous card" : "Next card"}
      onClick={onClick}
      draggable="false"
    />
  );
}

export default ArrowButton;
