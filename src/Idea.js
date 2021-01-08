import React, { useCallback } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

const style = {
  position: "absolute",
  border: "1px dashed gray",
  overflow: "hidden",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  cursor: "move",
};

export const Idea = ({ id, left, top, children, onEdit }) => {
  const hideSourceOnDrag = true;
  const [{ isDragging }, drag] = useDrag({
    item: { id, left, top, type: ItemTypes.IDEA },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDoubleClick = useCallback(
    (e) => {
      e.preventDefault();
      onEdit(id);
    },
    [onEdit, id]
  );

  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }
  return (
    <div
      ref={drag}
      style={{ ...style, left, top }}
      onDoubleClick={handleDoubleClick}
    >
      {children}
    </div>
  );
};
