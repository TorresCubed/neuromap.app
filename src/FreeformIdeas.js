import React, { useCallback, useReducer, useState } from "react";
import { useDrop } from "react-dnd";
import { Idea } from "./Idea";
import { ItemTypes } from "./ItemTypes";
import update from "immutability-helper";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";
import IdeaForm from "./IdeaForm";
import Arrow from "./Arrow";

const FreeFormIdeas = () => {
  const [ideas, ideasDispatch] = useReducer(
    (ideas, action) => {
      switch (action.type) {
        case "update":
          return update(ideas, {
            [action.id]: {
              $merge: action.data,
            },
          });
        case "create":
          return update(ideas, {
            [action.id]: {
              $set: Object.assign({ id: action.id, linkList: [] }, action.data),
            },
          });
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
        linkList: ["b"],
      },
      b: { id: "b", top: 180, left: 20, title: "Great Idea!", linkList: [] },
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

  const onLinkStart = useCallback((e) => {
    setLinkerEnd([e.clientY - 65, e.clientX]);
    setLinkingState(true);
  }, []);

  const adjustLinker = useCallback(
    (e) => {
      if (linkingState) {
        setLinkerEnd([e.clientY - 65, e.clientX]);
      }
    },
    [linkingState]
  );

  const onLinkEnd = useCallback(
    (id) => {
      if (selectedIdea.id !== id && linkingState) {
        if (!selectedIdea.linkList.includes(id)) {
          selectedIdea.linkList.push(id);
        }
      }
      setLinkingState(false);
    },
    [selectedIdea, linkingState]
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

  function calcCoords(height, width, arrowRotation, ideaTop, ideaLeft) {
    let top = 0;
    let left = 0;
    const referenceAngleOne =
      (180 / Math.PI) * Math.atan2(height / 2, width / 2);
    const referenceAngleTwo = 180 - referenceAngleOne;
    if (
      Math.abs(arrowRotation) > referenceAngleOne &&
      Math.abs(arrowRotation) < referenceAngleTwo
    ) {
      top = arrowRotation < 0 ? ideaTop : ideaTop + height;
      left =
        ideaLeft +
        width / 2 +
        (height / 2) *
          Math.tan(((90 - Math.abs(arrowRotation)) * Math.PI) / 180);
    } else if (Math.abs(arrowRotation) < referenceAngleOne) {
      top =
        ideaTop +
        height / 2 +
        (width / 2) * Math.tan((arrowRotation * Math.PI) / 180);
      left = ideaLeft + width;
    } else if (Math.abs(arrowRotation) > referenceAngleTwo) {
      top =
        ideaTop +
        height / 2 +
        (width / 2) * Math.tan(((180 - arrowRotation) * Math.PI) / 180);
      left = ideaLeft;
    }
    return [top, left];
  }

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
          linkStart={onLinkStart}
          linkDestination={onLinkEnd}
          ideasDispatch={ideasDispatch}
          {...idea}
        />
      ))}
      {selectedIdea?.linkList.map((endId) => {
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
