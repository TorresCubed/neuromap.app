import React, { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { Idea } from "./Idea";
import { ItemTypes } from "./ItemTypes";
import update from "immutability-helper";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";
import IdeaForm from "./IdeaForm";

const FreeForm = () => {
  const [ideas, setIdeas] = useState({
    a: { id: "a", top: 20, left: 80, title: "Here is an Example to get you Started" },
    b: { id: "b", top: 180, left: 20, title: "Great Idea!" },
  });

  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const ideaModalShow = useCallback(() => setShowIdeaModal(true), []);
  const ideaModalHide = useCallback(() => setShowIdeaModal(false), []);

  const [selectedIdea, setSelectedIdea] = useState();

  const [, drop] = useDrop({
    accept: ItemTypes.IDEA,
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      setIdeas(update(ideas, {
        [item.id]: {
          $merge: { left, top },
        },
      }));
    },
  });

  const editIdea = useCallback(
    (id) => {
      setSelectedIdea(ideas[id]);
      ideaModalShow(true);
    },
    [ideas, ideaModalShow]
  );

  const handleDoubleClick = useCallback(
    (e) => {
      if (e.target.className !== "FreeformMap") return;
      e.preventDefault();
      setSelectedIdea({top: e.nativeEvent.layerY, left: e.nativeEvent.layerX, title: ""});
      setTimeout(ideaModalShow, 300);
    },
    [ideaModalShow]
  );

  const handleIdeaChange = useCallback(
    (idea) => {
      if (!idea.id) idea = update(idea, {id: {$set: uuidv4()}});
      const { id, title } = idea;
      if (title === "") return;
      setIdeas(
        update(ideas, {
          [id]: {
            $set: idea,
          },
        })
      );
      setShowIdeaModal(false);
    },
    [ideas]
  );

  return (
    <div ref={drop} onDoubleClick={handleDoubleClick} className="FreeformMap">
      {showIdeaModal &&
        <Modal onClose={ideaModalHide}>
          <IdeaForm
            onSubmit={handleIdeaChange}
            idea={selectedIdea}
          />
        </Modal>}
      {Object.entries(ideas).map(([key, idea]) => (
        <Idea
          key={key}
          onEdit={editIdea}
          {...idea}
        />
      ))}
    </div>
  );
};

export default FreeForm;