import React from "react";
import "./App.css";
import FreeFormIdeas from "./FreeformIdeas";
import OptionBar from "./OptionBar";
import { ThemeContext, ThemeStateManagementProvider } from "./ThemeContext";
import { IdeaContext, IdeaStateManagementProvider } from "./IdeaContext";

const Window = () => {
  return (
    <div className="Containment">
      <IdeaContext.Provider value={IdeaStateManagementProvider()}>
        <ThemeContext.Provider value={ThemeStateManagementProvider()}>
          <FreeFormIdeas />
          <OptionBar />
        </ThemeContext.Provider>
      </IdeaContext.Provider>
    </div>
  );
};

export default Window;
