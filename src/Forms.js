import React, { useCallback} from "react";
import "./Forms.css";

const Forms = ({ onClose, onSubmit, formType, content, setContent }) => {

  const handleChange = useCallback((event) => setContent(event.target.value), [setContent]);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(content);
      onClose(e);
    },
    [onSubmit, onClose, content]
  );


  
  const entries = { 
    addForm: { 
      header: "Add an Idea", 
      label: "Enter Idea:", 
      submition: handleSubmit,
      button: "Add"
    },
    editForm: {
      header: "Would you like to change your Idea?",
      label: "New Idea:",
      submition: handleSubmit,
      button: "Change"
    }
  };
  
  return (
    <div className="form" >
      <h1>
        {entries[formType].header}
      </h1>
      <form onSubmit={entries[formType].submition}>
        <div>
          <label>{entries[formType].label}</label>
        </div>
        <div>
          <input type="text" value={content} onChange={handleChange} />
        </div>
        <div>
          <input className="submitButton" type="submit" value={entries[formType].button} />
        </div>
      <button onClick={onClose}>Exit</button>
      </form>
    </div>
  )

}

export default Forms;

      