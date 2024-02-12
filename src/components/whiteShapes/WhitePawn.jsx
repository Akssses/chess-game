import React from "react";

export default function WhitePawn({ onClick }) {
  return (
    <div onClick={onClick}>
      <img
        style={{ width: "50px", height: "50px" }}
        src="/assets/whiteShapes/pawn.png"
        alt="horse"
      />
    </div>
  );
}
