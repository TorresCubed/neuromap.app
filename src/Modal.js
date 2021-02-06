import React from "react";
import "./Modal.css";

const Modal = ({ onClose, children }) => (
  <div className="modal">
    <div>
      {children}
      <div className="closeButton" onClick={onClose}>
        &times;
      </div>
    </div>
  </div>
);

export default Modal;
