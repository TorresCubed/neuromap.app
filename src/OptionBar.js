import React, { useCallback, useContext, useState } from "react";
import IdeaForm from "./IdeaForm";
import { ThemeContext } from "./ThemeContext";
import { IdeaContext } from "./IdeaContext";
import update from "immutability-helper";
import { v4 as uuidv4 } from "uuid";
import "./OptionBar.css";
import { SketchPicker } from "react-color";

const OptionBar = () => {
  const ideaPackage = useContext(IdeaContext);
  const selectedId = ideaPackage.selectedId;
  const selectedIdea = ideaPackage.ideas[selectedId];

  const themePackage = useContext(ThemeContext);
  const [colorSelectorValue, setColorSelectorValue] = useState(0);
  const [background, setBackground] = useState("#800080");
  const [hiding, setHiding] = useState({ display: "none" });

  const changeColor = useCallback(
    (color) => {
      setBackground(color.hex);
      switch (colorSelectorValue) {
        case "1":
          themePackage.updateTheme({
            element: "optionBarColor",
            color: color.hex,
          });
          break;
        case "2":
          themePackage.updateTheme({
            element: "freeFormIdeasColor",
            color: color.hex,
          });
          break;
        case "3":
          themePackage.updateTheme({
            element: "selectedIdeaColor",
            color: color.hex,
          });
          break;
        default:
          return;
      }
    },
    [colorSelectorValue, themePackage]
  );

  const handleThemeSelection = useCallback((event) => {
    setColorSelectorValue(event.target.value);
    if (event.target.value === "0") {
      setHiding({ display: "none" });
      return;
    }
    setHiding({ display: "flex" });
  }, []);

  const [showIdeaChangeForm, setShowIdeaChangeForm] = useState(false);
  const toggleFormType = useCallback(() => {
    setShowIdeaChangeForm(!showIdeaChangeForm);
  }, [showIdeaChangeForm]);

  const handleIdeaChange = useCallback(
    (idea) => {
      if (idea.title === "") return;
      if (!idea.id) {
        const newID = uuidv4();
        ideaPackage.ideasDispatch({
          type: "create",
          id: newID,
          data: update(idea, { $merge: { top: 100, left: 100 } }),
        });
        ideaPackage.setSelectedId(newID);
        setShowIdeaChangeForm(false);
        return;
      }
      toggleFormType();
      ideaPackage.ideasDispatch({ type: "update", id: selectedId, data: idea });
    },
    [toggleFormType, selectedId, ideaPackage]
  );

  return (
    <div
      className="OptionBar"
      style={{ background: themePackage.theme.optionBarColor }}
    >
      <div className="selector">
        <button style={{ margin: "5px" }} onClick={toggleFormType}>
          Edit Selected Idea
        </button>
      </div>
      <div>
        <IdeaForm
          onSubmit={handleIdeaChange}
          idea={showIdeaChangeForm ? selectedIdea : {}}
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
