import React, { useState, useCallback } from "react";
import FreeForm from "./FreeformIdeas";
import Options from "./OptionBar";

const Window = () => {
  const [hideSourceOnDrag, setHideSrouceOnDrag] = useState(true);
  const toggle = useCallback(() => setHideSrouceOnDrag(!hideSourceOnDrag), [
    hideSourceOnDrag,
  ]);
  return (
    <div className="Containment">
      <FreeForm id="freeFormMap" hideSourceOnDrag={hideSourceOnDrag} />
      <Options />
    </div>
  );
};

export default Window;
