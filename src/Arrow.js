import React from "react";
import "./Arrow.css";

const Link = ({ start, end }) => {
  const arrowHeight = end[0] - start[0];
  const arrowWidth = end[1] - start[1];
  const arrowLength =
    Math.sqrt(arrowHeight * arrowHeight + arrowWidth * arrowWidth) - 4;
  const arrowRotation = (180 / Math.PI) * Math.atan2(arrowHeight, arrowWidth);

  const lineInfo = {
    top: start[0] + "px",
    left: start[1] + "px",
    width: arrowLength + "px",
    transform: "rotate(" + arrowRotation + "deg)",
  };

  return (
    <div style={lineInfo} className="line">
      <div className="arrow"></div>
    </div>
  );
};

export default Link;
