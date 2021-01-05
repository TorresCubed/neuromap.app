import React from 'react';
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



export const Idea = ({id,left,top,hideSourceOnDrag,children, }) => {
    const [{ isDragging }, drag] = useDrag({
        item: { id, left, top, type: ItemTypes.IDEA},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    if(isDragging && hideSourceOnDrag) {
        return <div ref={drag}/>;
    }
    return (<div ref={drag} style={{...style, left, top}}>
        {children}
    </div>);
};
