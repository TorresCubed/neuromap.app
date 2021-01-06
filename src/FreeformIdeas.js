import React, {useCallback, useState} from 'react';
import { useDrop } from 'react-dnd';
import { Idea } from './Idea';
import { ItemTypes } from './ItemTypes';
import update from 'immutability-helper';
import { v4 as uuidv4 } from 'uuid';
import Popup from './AddPopup';
import EditPopup from './EditPopup';


const FreeForm = ({ hideSourceOnDrag }) => {
    const [ideas, setIdeas] = useState({
        a: { top: 20, left: 80, title: 'Great Idea!'},
        b: { top: 180, left: 20, title: 'Here is an Example to get you started'},
    });
    const [coords, setCoords] = useState([0, 0]);
    const [popupShow, setPopupShow] = useState(false);
    const showPopup = useCallback(() => setPopupShow(true), [])
    const hidePopup = useCallback(() => setPopupShow(false), [])

    const [storedID, setStoredID] = useState("");
    const [editShow, setEdit] = useState(false);
    const showEdit = useCallback((id) => {
        setStoredID(id);
        setEdit(true)
    }, [])
    const hideEdit = useCallback(() => setEdit(false), [])

    const [, drop] = useDrop({
        accept: ItemTypes.IDEA,
        drop(item, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset();
            const left = Math.round(item.left + delta.x);
            const top = Math.round(item.top+delta.y);
            moveIdea(item.id,left,top);
            return undefined;
        },
    });
    const moveIdea = (id, left, top) => {
        setIdeas(update(ideas, {
            [id]:{
                $merge: {left, top},
            },
        }));
    };
    const editIdea = useCallback((title) => {
        setIdeas(update(ideas, {
            [storedID]:{
                $merge:{title},
            },
        }));
    }, [ideas, storedID]);
    const addIdea = useCallback((title) => {
        const id = uuidv4()
        const left = coords[0];
        const top = coords[1];
        setIdeas(update(ideas, {[id]: {$set: {top,left,title}}}));
    }, [coords, ideas]);
    const handleClick = useCallback((e) => {
        if(e.target.className !== "FreeformMap") return;
        e.preventDefault();
        setCoords([coords[0] = e.nativeEvent.layerX, coords[1] = e.nativeEvent.layerY]);
        setTimeout(showPopup,300);
    }, [coords, showPopup]);

    return (
        <div ref={drop} onDoubleClick={handleClick} className='FreeformMap'>
            <Popup show={popupShow} onClose={hidePopup} onSubmit={addIdea} />
            <EditPopup   closeEdit={hideEdit} show={editShow} onSubmit={editIdea}/>
            {
                Object.keys(ideas).map((key) => {
                    const { left, top, title } = ideas[key];
                    return (
                        <Idea key={key} id = {key} left = {left} top = {top} hideSourceOnDrag={hideSourceOnDrag} displayEdit={showEdit} >
                            {title}
                        </Idea>
                    );
                })
            }
        </div>
    );
};

export default FreeForm;

