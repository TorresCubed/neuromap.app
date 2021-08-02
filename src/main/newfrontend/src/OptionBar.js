import React, { useCallback, useContext, useState } from "react";
import IdeaForm from "./IdeaForm";
import { ThemeContext } from "./ThemeContext";
import { IdeaContext } from "./IdeaContext";
import update from "immutability-helper";
import { v4 as uuidv4 } from "uuid";
import "./OptionBar.css";
import { SketchPicker } from "react-color";

const OptionBar = () => {
  const { ideas, selectedId, setSelectedId, ideasDispatch } = useContext(
    IdeaContext
  );
  const selectedIdea = ideas[selectedId];

  const { theme, updateTheme } = useContext(ThemeContext);
  const [colorSelectorValue, setColorSelectorValue] = useState(0);
  const [background, setBackground] = useState("#800080");
  const [showColorPalet, setShowColorPalet] = useState(false);

  const changeColor = useCallback(
    (color) => {
      setBackground(color.hex);
      updateTheme({
        element: {
          1: "optionBarColor",
          2: "freeFormIdeasColor",
          3: "selectedIdeaColor",
        }[colorSelectorValue],
        color: color.hex,
      });
    },
    [colorSelectorValue, updateTheme]
  );

  const handleThemeSelection = useCallback((event) => {
    setColorSelectorValue(event.target.value);
    if (event.target.value === "0") {
      setShowColorPalet(false);
      return;
    }
    setShowColorPalet(true);
  }, []);

  const [showIdeaChangeForm, setShowIdeaChangeForm] = useState(false);
  const toggleFormType = useCallback(() => {
    setShowIdeaChangeForm(!showIdeaChangeForm);
  }, [showIdeaChangeForm]);


  const handleDelete = useCallback(
    () => {
      let deleteConfirmation = window.confirm(
        "Are you sure you wish to delete this idea?"
      );
      if(deleteConfirmation) {
        ideasDispatch({
          type: "deleteIdea",
          deleteId:selectedId
        })
      }
    }, 
    [selectedId, ideasDispatch]
  )

  const handleIdeaChange = useCallback(
    (idea) => {
      if (idea.content === "") return;
      if (!idea.ideaId) {
        const newID = uuidv4();
        ideasDispatch({
          type: "createIdea",
          ideaId: newID,
          data: update(idea, { $merge: { top: 100, left: 100 } }),
        });
        setSelectedId(newID);
        setShowIdeaChangeForm(false);
        return;
      }
      toggleFormType();
      ideasDispatch({ type: "update", ideaId: selectedId, data: idea });
    },
    [toggleFormType, selectedId, ideasDispatch, setSelectedId]
  );

  return (
    <div className="OptionBar" style={{ background: theme.optionBarColor }}>
      <div className="selector">
        <button style={{ margin: "5px" }} onClick={handleDelete}>
          Delete Selected Idea
        </button>
      </div>
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
      {showColorPalet && (
        <SketchPicker onChange={changeColor} color={background} />
      )}
    </div>
  );
};

export default OptionBar;
