import React, {useCallback} from 'react';
import {useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

const style = {
    position: 'absolute',
    border: '1px dashed gray',
    overflow: 'hidden',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    cursor: 'move',
};



export const Idea = ({id,left,top,hideSourceOnDrag,children,displayEdit }) => {
    const [{ isDragging }, drag] = useDrag({
        item: { id, left, top, type: ItemTypes.IDEA},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    
    

    const handleClick = useCallback((e) => {
        e.preventDefault();
        displayEdit(id);
    }, [displayEdit, id]);




    if(isDragging && hideSourceOnDrag) {
        return <div ref={drag}/>;
    }
    return (<div ref={drag} style={{...style, left, top}} onDoubleClick={handleClick}>
        {children}
    </div>);
};
