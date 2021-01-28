import React, { useState, useCallback } from "react";
import Window from "./Window";
import "./App.css";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export const headerContext = React.createContext({});

const App = () => {
  const [headerHeight, setHeaderHeight] = useState(65);

  const domElementRef = useCallback((domElementReference) => {
    setHeaderHeight(domElementReference.offsetHeight);
  }, []);

  return (
    <div className="App">
      <header ref={domElementRef} className="App-header">
        <h1>Map Your Ideas Below</h1>
      </header>
      <div>
        <headerContext.Provider value={headerHeight}>
          <DndProvider backend={HTML5Backend}>
            <Window />
          </DndProvider>
        </headerContext.Provider>
      </div>
    </div>
  );
};

export default App;
