import React, { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { Idea } from "./Idea";
import { ItemTypes } from "./ItemTypes";
import update from "immutability-helper";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";
import Forms from "./Forms";

const FreeForm = () => {
  const [ideas, setIdeas] = useState({
    a: { top: 20, left: 80, title: "Here is an Example to get you Started" },
    b: { top: 180, left: 20, title: "Great Idea!" },
  });
  const [coords, setCoords] = useState([0, 0]);
  const [showAddModal, setAddModal] = useState(false);
  const [showEditModal, setEditModal] = useState(false);

  const showAdd = useCallback(() => setAddModal(true), []);
  const hideAdd = useCallback(
    (e) => {
      e.preventDefault();
      setAddModal(false);
    }, 
    []
  );

  const showEdit = useCallback(() => setEditModal(true), []);
  const hideEdit = useCallback(
    (e) => {
      e.preventDefault();
      setEditModal(false);
    },
    []
  );

  const [storedID, setStoredID] = useState("");
  const [ideaContent, setIdeaContent] = useState("");

  const showEditor = useCallback(
    (id,children) => {
      setStoredID(id);
      setIdeaContent(children);
      showEdit(true);
    },
    [showEdit]
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
      setIdeaContent("");
      setTimeout(showAdd, 300);
    },
    [showAdd]
  );

  return (
    <div ref={drop} onDoubleClick={handleClick} className="FreeformMap">
      <Modal
        show={showAddModal}
      >
        <Forms
          onClose={hideAdd}
          onSubmit={addIdea}
          formType={"addForm"}
          content={ideaContent}
          setContent={setIdeaContent}
        />
      </Modal>
      <Modal
        show={showEditModal}
      >
        <Forms
          onClose={hideEdit}
          onSubmit={editIdea}
          formType={"editForm"}
          content={ideaContent}
          setContent={setIdeaContent}
        />
      </Modal>
      {Object.keys(ideas).map((key) => {
        const { left, top, title } = ideas[key];
        return (
          <Idea
            key={key}
            id={key}
            left={left}
            top={top}
            onEdit={showEditor}
          >
            {title}
          </Idea>
        );
      })}
    </div>
  );
};

export default FreeForm;
