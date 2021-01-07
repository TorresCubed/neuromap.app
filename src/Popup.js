import React, {useCallback, useState} from 'react';
import './Popup.css';


const Popup = ({show, onClose, onSubmit, formType}) => {
    const [value, setValue] = useState("");

    const handleChange = useCallback(event => setValue(event.target.value), []);
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        onSubmit(value);
        setValue("");
        onClose();
    }, [value, onSubmit, onClose]);

    return(
        <div className={"popup" + (show ? "" : " hidden")} id="myPopUp" >
            <div>
                <h1>{formType ? "Add an Idea" : "Would you like to change your Idea?"}</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>{formType ? "Enter Idea:" : "New Idea:"}</label>
                    </div>
                    <div>
                        <input type="text" value={value} onChange={handleChange} />
                    </div>
                    <div>
                        <input className="submitButton" type="submit" value="Add"/>
                    </div>
                </form>
                    <button onClick={onClose}>Exit</button>
                
            </div>
        </div>
    );
}



export default Popup;

