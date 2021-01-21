import React from "react";
import FreeFormIdeas from "./FreeformIdeas";
import OptionBar from "./OptionBar";

const Canvas = () => {
  return (
    <div className="Containment">
      <FreeFormIdeas id="freeFormMap" />
      <OptionBar />
    </div>
  );
};

export default Canvas;
