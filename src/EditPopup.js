import React, {useCallback, useState} from 'react';
import './Popup.css';


const EditPopup = ({show, closeEdit, onSubmit}) => {
    const [value, setValue] = useState("");

    const handleChange = useCallback(event => setValue(event.target.value), []);
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        onSubmit(value);
        setValue("");
        closeEdit();
    }, [value, onSubmit, closeEdit]);

    return(
        <div className={"editWrapper" + (show ? '' : ' hidden')}>
            <div className={'edit'} id="editPopup">
                <h1 className="editHeader">Would you like to change your Idea?</h1>
                <form onSubmit={handleSubmit}>
                    <label>New Idea:</label><br/>
                    <input type="text" value={value} onChange={handleChange} /><br/>
                    <input className="submitButton" type="submit" value="Yes Please!"/>
                </form>
                <button onClick={closeEdit}>No Thanks</button>
                
            </div>
        </div>
    );
}

export default EditPopup;