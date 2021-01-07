import React, { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { Idea } from "./Idea";
import { ItemTypes } from "./ItemTypes";
import update from "immutability-helper";
import { v4 as uuidv4 } from "uuid";
import Popup from "./Popup";

const FreeForm = ({ hideSourceOnDrag }) => {
  const [ideas, setIdeas] = useState({
    a: { top: 20, left: 80, title: "This is one idea" },
    b: { top: 180, left: 20, title: "This is also an idea" },
  });
  const [coords, setCoords] = useState([0, 0]);
  const [popupShow, setPopupShow] = useState(false);
  const showPopup = useCallback(() => setPopupShow(true), []);
  const hidePopup = useCallback(() => setPopupShow(false), []);
  const [, drop] = useDrop({
    accept: ItemTypes.IDEA,
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      moveIdea(item.id, left, top);
      return undefined;
    },
  });
  const moveIdea = (id, left, top) => {
    setIdeas(
      update(ideas, {
        [id]: {
          $merge: { left, top },
        },
      })
    );
  };
  const addIdea = useCallback(
    (title) => {
      const id = uuidv4();
      const top = 200;
      const left = 200;
      setIdeas(update(ideas, { [id]: { $set: { top, left, title } } }));
    },
    [ideas]
  );
  const handleClick = useCallback(
    (e) => {
      if (e.target.className !== "FreeformMap") return;
      e.preventDefault();
      setTimeout(showPopup, 300);
    },
    [showPopup]
  );

  return (
    <div ref={drop} onDoubleClick={handleClick} className="FreeformMap">
      <Popup show={popupShow} onClose={hidePopup} onSubmit={addIdea} />
      {Object.keys(ideas).map((key) => {
        const { left, top, title } = ideas[key];
        return (
          <Idea
            key={key}
            id={key}
            left={left}
            top={top}
            hideSourceOnDrag={hideSourceOnDrag}
          >
            {title}
          </Idea>
        );
      })}
    </div>
  );
};

export default FreeForm;
