import React, { useCallback } from "react";
import "./Arrow.css";

const Arrow = ({startId, endId, start, end, onLinkAdjust}) => {
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
  
  const linkAdjust = useCallback(() => {
      onLinkAdjust(startId, endId, start, end);
  },[startId, endId, onLinkAdjust, start, end])
  
  return (
    <div style={lineInfo} className="line">
      <div className="arrow" onMouseDown={linkAdjust}></div>
    </div>
  );
};

export default Arrow;
