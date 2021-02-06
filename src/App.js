import React from "react";
import Window from "./Window";
import "./App.css";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const App = () => (
  <div className="App">
    <header className="App-header">
      <h1>Map Your Ideas Below</h1>
    </header>
    <DndProvider backend={HTML5Backend}>
      <Window />
    </DndProvider>
  </div>
);

export default App;
