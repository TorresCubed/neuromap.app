import React from "react";
import "./App.css";
import FreeFormIdeas from "./FreeformIdeas";
import OptionBar from "./OptionBar";
import { ThemeContext, useThemeManager } from "./ThemeContext";
import { IdeaContext, useIdeaManager } from "./IdeaContext";

const Window = () => {
  const ideaContext = useIdeaManager();
  const themeContext = useThemeManager();

  return (
    <div className="Containment">
      <IdeaContext.Provider value={ideaContext}>
        <ThemeContext.Provider value={themeContext}>
          <FreeFormIdeas />
          <OptionBar />
        </ThemeContext.Provider>
      </IdeaContext.Provider>
    </div>
  );
};

export default Window;
