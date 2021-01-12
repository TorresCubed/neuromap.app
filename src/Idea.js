import React, { useCallback } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import linker from "./linkerIcon.JPG";
import "./Idea.css";

export const Idea = ({ id, left, top, title, onEdit, selected, onSelect }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { id, left, top, title, type: ItemTypes.IDEA },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const select = useCallback(() => onSelect(id), [onSelect, id]);

  const handleDoubleClick = useCallback(
    (e) => {
      e.preventDefault();
      onEdit(id, title);
    },
    [onEdit, id, title]
  );

  if (isDragging) {
    return <div ref={drag} />;
  }
  return (
    <div
      ref={drag}
      style={{ left, top }}
      onDoubleClick={handleDoubleClick}
      className={"idea" + (selected ? " selected" : "")}
      onClick={select}
    >
      <img className="linker" src={linker} alt="link" />
      {title}
    </div>
  );
};
