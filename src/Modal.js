import React from "react";
import "./Modal.css";

const Modal = ({ onClose, children }) => (
  <div className="modal">
    <div>
      {children}
      <button onClick={onClose}>Exit</button>
    </div>
  </div>
);

export default Modal;
