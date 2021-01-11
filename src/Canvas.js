import React from "react";
import FreeForm from "./FreeformIdeas";
import Options from "./OptionBar";

const Window = () => {
  return (
    <div className="Containment">
      <FreeForm id="freeFormMap" />
      <Options />
    </div>
  );
};

export default Window;
