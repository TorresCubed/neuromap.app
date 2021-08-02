import React, { useCallback, useState } from "react";
import update from "immutability-helper";
import "./IdeaForm.css";

const IdeaForm = ({ onSubmit, idea }) => {
  const [ideaState, setIdeaState] = useState(idea || { title: "" });

  if (ideaState.id !== idea?.id) {
    setIdeaState(idea || { title: "" });
  }

  const handleChange = useCallback(
    (event) =>
      setIdeaState(update(ideaState, { title: { $set: event.target.value } })),
    [ideaState]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(ideaState);
      setIdeaState({ title: "" });
    },
    [onSubmit, ideaState]
  );

  const entries = {
    addForm: {
      header: "Add an Idea",
      label: "Enter Idea:",
      button: "Add",
    },
    editForm: {
      header: "Enter Idea Change",
      label: "Change Idea:",
      button: "Change",
    },
  };

  const formType = ideaState.id ? "editForm" : "addForm";

  return (
    <div className="form">
      <h1>{entries[formType].header}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{entries[formType].label}</label>
        </div>
        <div>
          <textarea value={ideaState.title} onChange={handleChange} />
        </div>
        <div>
          <input
            className="submitButton"
            type="submit"
            value={entries[formType].button}
          />
        </div>
      </form>
    </div>
  );
};

export default IdeaForm;
