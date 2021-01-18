import React, { useCallback, useLayoutEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import linker from "./linkerIcon.JPG";
import "./Idea.css";

export const Idea = ({
  id,
  left,
  top,
  title,
  linkList,
  onEdit,
  selected,
  onSelect,
  linkStart,
  linkDestination,
  ideasDispatch,
}) => {
  const [domElement, setDomElement] = useState();

  useLayoutEffect(() => {
    ideasDispatch({
      type: "update",
      id,
      data: {
        width: domElement?.offsetWidth,
        height: domElement?.offsetHeight,
      },
    });
  });

  const [{ isDragging }, drag] = useDrag({
    item: { id, left, top, title, linkList, type: ItemTypes.IDEA },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const domElementRef = useCallback(
    (domElement) => {
      setDomElement(domElement);
      drag(domElement);
    },
    [drag]
  );

  const select = useCallback(() => onSelect(id), [onSelect, id]);

  const handleDoubleClick = useCallback(
    (e) => {
      e.preventDefault();
      onEdit(id, title);
    },
    [onEdit, id, title]
  );

  const linkInitiation = useCallback(
    (e) => {
      e.preventDefault();
      linkStart(e);
    },
    [linkStart]
  );

  const linkerDesignation = useCallback(() => {
    linkDestination(id);
  }, [linkDestination, id]);

  // if (isDragging) {
  //   return <div ref={drag} />;
  // }
  return (
    <div
      ref={domElementRef}
      style={{ left, top }}
      onDoubleClick={handleDoubleClick}
      className={"idea" + (selected ? " selected" : "")}
      onClick={select}
      onMouseUp={linkerDesignation}
    >
      <img
        className="linker"
        src={linker}
        alt="link"
        onMouseDown={linkInitiation}
      />
      {title}
    </div>
  );
};
