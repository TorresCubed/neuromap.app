import React, { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { Idea } from "./Idea";
import { ItemTypes } from "./ItemTypes";
import update from "immutability-helper";
import { v4 as uuidv4 } from "uuid";
import Popup from "./Popup";

const FreeForm = () => {
  const hideSourceOnDrag = true;
  const [ideas, setIdeas] = useState({
    a: { top: 20, left: 80, title: "Here is an Example to get you Started" },
    b: { top: 180, left: 20, title: "Great Idea!" },
  });
  const [coords, setCoords] = useState([0, 0]);
  const [popupShow, setPopupShow] = useState(false);
  const showPopup = useCallback(() => {
    setPopupShow(true);
    setFormType(true);
  }, []);
  const hidePopup = useCallback(() => setPopupShow(false), []);

  const [storedID, setStoredID] = useState("");
  const [formType, setFormType] = useState(true);

  const showEdit = useCallback(
    (id) => {
      setStoredID(id);
      showPopup(true);
      setFormType(false);
    },
    [showPopup]
  );

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
  const editIdea = useCallback(
    (title) => {
      if (title != null) {
        setIdeas(
          update(ideas, {
            [storedID]: {
              $merge: { title },
            },
          })
        );
      }
    },
    [ideas, storedID]
  );
  const addIdea = useCallback(
    (title) => {
      const id = uuidv4();
      const left = coords[0];
      const top = coords[1];
      setIdeas(update(ideas, { [id]: { $set: { top, left, title } } }));
    },
    [coords, ideas]
  );
  const handleClick = useCallback(
    (e) => {
      if (e.target.className !== "FreeformMap") return;
      e.preventDefault();
      setCoords([e.nativeEvent.layerX, e.nativeEvent.layerY]);
      setTimeout(showPopup, 300);
    },
    [showPopup]
  );

  return (
    <div ref={drop} onDoubleClick={handleClick} className="FreeformMap">
      <Popup
        show={popupShow}
        onClose={hidePopup}
        onSubmit={formType ? addIdea : editIdea}
        formType={formType}
      />
      {Object.keys(ideas).map((key) => {
        const { left, top, title } = ideas[key];
        return (
          <Idea
            key={key}
            id={key}
            left={left}
            top={top}
            hideSourceOnDrag={hideSourceOnDrag}
            onEdit={showEdit}
          >
            {title}
          </Idea>
        );
      })}
    </div>
  );
};

export default FreeForm;
