import React, { useCallback, useContext, useState } from "react";
import IdeaForm from "./IdeaForm";
import { IdeaContext } from "./Window";
import update from "immutability-helper";
import { v4 as uuidv4 } from "uuid";
import "./OptionBar.css";
import { SketchPicker } from "react-color";

const OptionBar = () => {
  const ideaPackage = useContext(IdeaContext);
  const selectedId = ideaPackage.selectedId;
  const selectedIdea = ideaPackage.ideas[selectedId];

  const [colorSelectorValue, setColorSelectorValue] = useState(0);
  const [hiding, setHiding] = useState({ display: "none" });
  const [optionBarColor, setOptionBarColor] = useState("#800080");
  const [background, setBackground] = useState("#800080");
  const [ideaFormType, setIdeaFormType] = useState(false);
  const toggleFormType = useCallback(() => {
    setIdeaFormType(!ideaFormType);
  }, [ideaFormType]);

  const changeColor = useCallback(
    (color) => {
      setBackground(color.hex);
      switch (colorSelectorValue) {
        case "1":
          setOptionBarColor(color.hex);
          break;
        case "2":
          ideaPackage.setFreeFormIdeasColor(color.hex);
          break;
        case "3":
          ideaPackage.setSelectedIdeaColor(color.hex);
          break;
        default:
          return;
      }
    },
    [colorSelectorValue, ideaPackage]
  );

  const handleIdeaChange = useCallback(
    (idea) => {
      toggleFormType();
      if (idea.title === "") return;
      const newID = uuidv4();
      if (!idea.id) {
        ideaPackage.ideasDispatch({
          type: "create",
          id: newID,
          data: update(idea, { $merge: { top: 100, left: 100 } }),
        });
        ideaPackage.setSelectedId(newID);
        setIdeaFormType("");
        return;
      }
      ideaPackage.ideasDispatch({ type: "update", id: selectedId, data: idea });
    },
    [toggleFormType, selectedId, ideaPackage]
  );

  const handleThemeSelection = useCallback((event) => {
    setColorSelectorValue(event.target.value);
    if (event.target.value === "0") {
      setHiding({ display: "none" });
      return;
    }
    setHiding({ display: "flex" });
  }, []);

  return (
    <div className="OptionBar" style={{ background: optionBarColor }}>
      <div className="selector">
        <button style={{ margin: "5px" }} onClick={toggleFormType}>
          Edit Selected Idea
        </button>
      </div>
      <div>
        <IdeaForm
          onSubmit={handleIdeaChange}
          idea={ideaFormType ? selectedIdea : {}}
        />
      </div>
      <div className="selector">
        <div>Select what you'd like to customize</div>
        <select style={{ margin: "5px" }} onChange={handleThemeSelection}>
          <option value="0">None</option>
          <option value="1">Option Bar</option>
          <option value="2">Idea Canvas</option>
          <option value="3">Selection Outline</option>
        </select>
      </div>
      <div style={hiding}>
        <SketchPicker onChange={changeColor} color={background} />
      </div>
    </div>
  );
};

export default OptionBar;
