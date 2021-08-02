import React, { useCallback, useLayoutEffect, useContext, useRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import linker from "./linkerIcon.JPG";
import { IdeaContext } from "./IdeaContext";
import { ThemeContext } from "./ThemeContext";
import "./Idea.css";

export const Idea = ({
  ideaId,
  left,
  top,
  content,
  linkList,
  onEdit,
  selected,
  onSelect,
  onLinkStart,
  onLinkEnd,
}) => {
  const { theme } = useContext(ThemeContext);

  const { ideasDispatch } = useContext(IdeaContext);

  const domElement = useRef();
  useLayoutEffect(() => {
    ideasDispatch({
      type: "updateSize",
      ideaId,
      data: {
        width: domElement.current?.offsetWidth,
        height: domElement.current?.offsetHeight,
      },
    });
  });

  const [, drag] = useDrag({
    item: { ideaId, left, top, content, linkList, type: ItemTypes.IDEA },
  });

  const domElementRef = useCallback(
    (domElementReference) => {
      domElement.current = domElementReference;
      drag(domElementReference);
    },
    [drag]
  );

  const handleSelect = useCallback(() => onSelect(ideaId), [onSelect, ideaId]);

  const handleDoubleClick = useCallback(
    (e) => {
      e.preventDefault();
      onEdit(ideaId, content);
    },
    [onEdit, ideaId, content]
  );

  const linkInitiation = useCallback(
    (e) => {
      e.preventDefault();
      onLinkStart(e);
    },
    [onLinkStart]
  );

  const linkerDesignation = useCallback(() => {
    onLinkEnd(ideaId);
  }, [onLinkEnd, ideaId]);

  let selectedStyle = selected
    ? {
        border: `2px solid ${theme.selectedIdeaColor}`,
        boxShadow: `4px 4px 15px ${theme.selectedIdeaColor}`,
        zIndex: "2",
      }
    : {};

  return (
    <div
      ref={domElementRef}
      style={{ left, top, ...selectedStyle }}
      onDoubleClick={handleDoubleClick}
      className={"idea" + (selected ? " selected" : "")}
      onMouseUp={linkerDesignation}
      onClick={handleSelect}
    >
      <img
        className="linker"
        src={linker}
        alt="link"
        onMouseDown={linkInitiation}
      />
      {content}
    </div>
  );
};
