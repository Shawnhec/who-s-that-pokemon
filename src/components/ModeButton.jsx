import React from "react";

function ModeButton({src, selected, onClick, children}) {
  return (
    <button
      type="button"
      className={`ball-button ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <img
        className="ball-button-image"
        src={src}
        alt=""
        draggable="false"
      />
      <span className="ball-button-label">{children}</span>
    </button>
  );
}

export default ModeButton;
