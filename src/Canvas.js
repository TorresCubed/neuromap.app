import React from "react";
import FreeFormIdeas from "./FreeformIdeas";
import OptionsBar from "./OptionBar";

const Canvas = () => {
  return (
    <div className="Containment">
      <FreeFormIdeas id="freeFormMap" />
      <OptionsBar />
    </div>
  );
};

export default Canvas;
