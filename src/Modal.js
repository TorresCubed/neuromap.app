import React from "react";
import "./Modal.css";

const Modal = ({ show, children }) => {

  return (
    <div 
      className={"modal" + (show ? "" : " hidden")} 
    >    
      <div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
