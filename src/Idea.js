import React, {
  useCallback,
  useLayoutEffect,
  useContext,
  useRef,
} from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import linker from "./linkerIcon.JPG";
import { IdeaContext } from "./IdeaContext";
import { ThemeContext } from "./ThemeContext";
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
  onLinkStart,
  onLinkEnd,
}) => {

  const themePackage = useContext(ThemeContext);

  const ideaPackage = useContext(IdeaContext);

  const domElement = useRef();
  useLayoutEffect(() => {
    ideaPackage.ideasDispatch({
      type: "update",
      id,
      data: {
        width: domElement.current?.offsetWidth,
        height: domElement.current?.offsetHeight,
      },
    });
  });

  const [, drag] = useDrag({
    item: { id, left, top, title, linkList, type: ItemTypes.IDEA },
  });

  const domElementRef = useCallback(
    (domElementReference) => {
      domElement.current = domElementReference;
      drag(domElementReference);
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
      onLinkStart(e);
    },
    [onLinkStart]
  );

  const linkerDesignation = useCallback(() => {
    onLinkEnd(id);
  }, [onLinkEnd, id]);

  let selectedStyle = selected
    ? {
        border: `2px solid ${themePackage.theme.selectedIdeaColor}`,
        boxShadow: `4px 4px 15px ${themePackage.theme.selectedIdeaColor}`,
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
      onClick={select}
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
