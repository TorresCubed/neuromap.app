import React, { useCallback, useState } from "react";
import "./Popup.css";

const Popup = ({ show, onClose, onSubmit }) => {
  const [value, setValue] = useState("");

  const handleChange = useCallback((event) => setValue(event.target.value), []);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(value);
      setValue("");
      onClose();
    },
    [value, onSubmit, onClose]
  );

  return (
    <div className={"popup" + (show ? "" : " hidden")} id="myPopUp">
      <div className="popupInner">
        <h1>Add an Idea</h1>
        <form onSubmit={handleSubmit}>
          <label>Enter Idea:</label>
          <br />
          <input type="text" value={value} onChange={handleChange} />
          <br />
          <input className="submitButton" type="submit" value="Add" />
        </form>
        <button onClick={onClose}>Exit</button>
      </div>
    </div>
  );
};

export default Popup;
