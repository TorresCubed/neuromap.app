import React from "react";
import Window from "./Window";
import "./App.css";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";


const App = () => {

  return (
    <div className="App">
      <header className="App-header">
        <h1>Map Your Ideas Below</h1>
      </header>
      <div>
          <DndProvider backend={HTML5Backend}>
            <Window />
          </DndProvider>
      </div>
    </div>
  );
};

export default App;
