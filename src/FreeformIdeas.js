import React, { useCallback, useReducer, useState } from "react";
import { useDrop } from "react-dnd";
import { Idea } from "./Idea";
import { ItemTypes } from "./ItemTypes";
import update from "immutability-helper";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";
import IdeaForm from "./IdeaForm";
import Arrow from "./Arrow";

  const heightAdjustment = 65;

  function calcCoords(height, width, arrowRotation, ideaTop, ideaLeft) {
    const posArrowRotation = Math.abs(arrowRotation);
    const referenceAngleOne =
      (180 / Math.PI) * Math.atan2(height / 2, width / 2);
    const referenceAngleTwo = 180 - referenceAngleOne;
    if (
      posArrowRotation > referenceAngleOne &&
      posArrowRotation < referenceAngleTwo
    ) {
      const top = arrowRotation < 0 ? ideaTop : ideaTop + height;
      const left =
        ideaLeft +
        width / 2 +
        (height / 2) *
         Math.tan(((90 - posArrowRotation) * Math.PI) / 180);
      return [top, left];
    } else if (posArrowRotation < referenceAngleOne) {
      const top =
        ideaTop +
        height / 2 +
        (width / 2) * Math.tan((arrowRotation * Math.PI) / 180);
      const left = ideaLeft + width;
      return [top, left];
    } else {
      const top =
        ideaTop +
        height / 2 +
        (width / 2) * Math.tan(((180 - arrowRotation) * Math.PI) / 180);
      const left = ideaLeft;
      return [top, left];
    }
  }

const FreeFormIdeas = () => {
  const [ideas, ideasDispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "update":
          return update(state, {
            [action.id]: {
              $merge: action.data,
            },
          });
        case "create":
          return update(state, {
            [action.id]: {
              $set: Object.assign({ id: action.id, linkList: new Set() }, action.data),
            },
          });
        case "link":
          return update(state, {
            [action.fromId]: {
              linkList: {$add: [action.toId]},
            }
          })
        default:
          throw new Error(`Unexpected action type: ${action.type}`);
      }
    },
    {
      a: {
        id: "a",
        top: 20,
        left: 80,
        title: "Here is an Example to get you Started",
        linkList: new Set("b"),
      },
      b: { id: "b", top: 180, left: 20, title: "Great Idea!", linkList:  new Set() },
    }
  );

  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const ideaModalShow = useCallback(() => setShowIdeaModal(true), []);
  const ideaModalHide = useCallback(() => setShowIdeaModal(false), []);

  const [selectedId, setSelectedId] = useState("a");
  const selectedIdea = ideas[selectedId];

  const [linkerEnd, setLinkerEnd] = useState();
  const [linkingState, setLinkingState] = useState(false);
  const linkBreak = useCallback(() => setLinkingState(false), []);

  const handleLinkStart = useCallback((e) => {
    setLinkerEnd([e.clientY - heightAdjustment, e.clientX]);
    setLinkingState(true);
  }, []);

  const adjustLinker = useCallback(
    (e) => {
      if (!linkingState) return;
      setLinkerEnd([e.clientY - heightAdjustment, e.clientX]);
    },
    [linkingState]
  );

  const handleLinkEnd = useCallback(
    (id) => {      
      setLinkingState(false);
      if(id === selectedId || !linkingState) return;
      ideasDispatch({type: "link", fromId: selectedId, toId: id});
    },
    [selectedId, linkingState ]
  );

  const [, drop] = useDrop({
    accept: ItemTypes.IDEA,
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      ideasDispatch({ type: "update", id: item.id, data: { left, top } });
    },
  });

  const editIdea = useCallback(
    (id) => {
      setSelectedId(id);
      ideaModalShow(true);
    },
    [setSelectedId, ideaModalShow]
  );

  const handleDoubleClick = useCallback(
    (e) => {
      if (e.target.className !== "FreeformMap") return;
      e.preventDefault();
      setCoords({
        top: e.nativeEvent.layerY,
        left: e.nativeEvent.layerX,
      });
      setSelectedId(uuidv4());
      setTimeout(ideaModalShow, 300);
    },
    [ideaModalShow]
  );

  const handleIdeaChange = useCallback(
    (idea) => {
      if (idea.title === "") return;
      setShowIdeaModal(false);
      if (!idea.id) {
        ideasDispatch({
          type: "create",
          id: selectedId,
          data: update(idea, { $merge: coords }),
        });
        return;
      }
      ideasDispatch({ type: "update", id: selectedId, data: idea });
    },
    [coords, selectedId]
  );
  return (
    <div
      className="FreeformMap"
      ref={drop}
      onDoubleClick={handleDoubleClick}
      onMouseUp={linkBreak}
      onMouseMove={adjustLinker}
    >
      {showIdeaModal && (
        <Modal onClose={ideaModalHide}>
          <IdeaForm onSubmit={handleIdeaChange} idea={selectedIdea} />
        </Modal>
      )}
      {Object.entries(ideas).map(([key, idea]) => (
        <Idea
          key={key}
          onEdit={editIdea}
          onSelect={setSelectedId}
          selected={idea.id === selectedIdea?.id}
          onLinkStart={handleLinkStart}
          onLinkEnd={handleLinkEnd}
          ideasDispatch={ideasDispatch}
          {...idea}
        />
      ))}
      {Array.from(selectedIdea?.linkList || [], (endId) => {
        const arrowHeight =
          ideas[endId].top +
          ideas[endId].height / 2 -
          (selectedIdea.top + selectedIdea.height / 2);
        const arrowWidth =
          ideas[endId].left +
          ideas[endId].width / 2 -
          (selectedIdea.left + selectedIdea.width / 2);
        const arrowRotationStart =
          (180 / Math.PI) * Math.atan2(arrowHeight, arrowWidth);
        const arrowRotationEnd =
          arrowRotationStart - 180 * Math.sign(arrowRotationStart);
        return (
          <Arrow
            key={`${selectedId} -> ${endId}`}
            start={calcCoords(
              selectedIdea.height,
              selectedIdea.width,
              arrowRotationStart,
              selectedIdea.top,
              selectedIdea.left
            )}
            end={calcCoords(
              ideas[endId].height,
              ideas[endId].width,
              arrowRotationEnd,
              ideas[endId].top,
              ideas[endId].left
            )}
          />
        );
      })}
      {linkingState && (
        <Arrow start={[selectedIdea.top, selectedIdea.left]} end={linkerEnd} />
      )}
    </div>
  );
};

export default FreeFormIdeas;
