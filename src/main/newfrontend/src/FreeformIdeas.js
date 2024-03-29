import React, {
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { IdeaContext } from "./IdeaContext";
import { ThemeContext } from "./ThemeContext";
import { useDrop } from "react-dnd";
import { Idea } from "./Idea";
import { ItemTypes } from "./ItemTypes";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";
import IdeaForm from "./IdeaForm";
import update from "immutability-helper";
import Arrow from "./Arrow";
import "./FreeFormIdeas.css";

/**
 * Calculates the coordinates of the end of arrow, pointing to the idea
 *
 * @param {{ height: number, width: number, top: number, left: number }} idea The idea the arrow is pointing to/from
 * @param {number} arrowRotation The rotation of the arrow (in degrees) in the range (-180, 180]
 * @returns {[number, number]} The coordinates ([top, left]) of the end of the arrow
 */
export function calcCoords(idea, arrowRotation) {
  const { height, width, top: ideaTop, left: ideaLeft } = idea;
  const posArrowRotation = Math.abs(arrowRotation);
  const referenceAngleOne = (180 / Math.PI) * Math.atan2(height, width);
  const referenceAngleTwo = 180 - referenceAngleOne;
  let top, left;

  if (
    posArrowRotation > referenceAngleOne &&
    posArrowRotation < referenceAngleTwo
  ) {
    top = ideaTop + (arrowRotation < 0 ? 0 : height);
    left =
      ideaLeft +
      width / 2 +
      (height / 2) * Math.tan(((90 - posArrowRotation) * Math.PI) / 180);
  } else {
    const isOnRight = posArrowRotation <= referenceAngleOne;

    top =
      ideaTop +
      height / 2 +
      (width / 2) *
        Math.tan(
          ((isOnRight ? arrowRotation : 180 - arrowRotation) * Math.PI) / 180
        );
    left = ideaLeft + (isOnRight ? width : 0);
  }
  return [top, left].map(Math.round);
}

const FreeFormIdeas = () => {
  const { theme } = useContext(ThemeContext);

  const { ideas, ideasDispatch, selectedId, setSelectedId } = useContext(
    IdeaContext
  );
  const selectedIdea = ideas[selectedId];

  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const ideaModalShow = useCallback(() => setShowIdeaModal(true), []);
  const ideaModalHide = useCallback(() => setShowIdeaModal(false), []);

  const [linkerEnd, setLinkerEnd] = useState();
  const [linkerStart, setlinkerStart] = useState();
  const [linkingState, setLinkingState] = useState(false);
  const linkBreak = useCallback(() => setLinkingState(false), []);

  const domElement = useRef();
  const [canvasOffset, setcanvasOffset] = useState(60);
  const updateCanvasOffset = () => {
    setcanvasOffset(domElement.current.getBoundingClientRect().y);
  };

  const handleLinkAdjust = useCallback(
    (startId, endId, start, end) => {
      ideasDispatch({type: "deleteLink", ideaId: startId, linkToRemove: endId})
      setLinkerEnd(end);
      setlinkerStart(start);
      setLinkingState(true);
  },[ideasDispatch]);

  const handleLinkStart = useCallback(
    (e) => {
      setLinkerEnd([e.clientY - canvasOffset, e.clientX]);
      setlinkerStart([selectedIdea.top, selectedIdea.left]);
      setLinkingState(true);
    },
    [canvasOffset, selectedIdea]
  );

  const adjustLinker = useCallback(
    (e) => {
      if (!linkingState) return;
      setLinkerEnd([e.clientY - canvasOffset, e.clientX]);
    },
    [linkingState, canvasOffset]
  );

  const handleLinkEnd = useCallback(
    (ideaId) => {
      setLinkingState(false);
      if (ideaId === selectedId || !linkingState) return;
      ideasDispatch({ type: "createLink", fromId: selectedId, toId: ideaId });
    },
    [selectedId, linkingState, ideasDispatch]
  );

  const [, drop] = useDrop({
    accept: ItemTypes.IDEA,
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      ideasDispatch({
        type: "update",
        ideaId: item.ideaId,
        data: { left, top },
      });
    },
  });

  const editIdea = useCallback(
    (ideaId) => {
      setSelectedId(ideaId);
      ideaModalShow(true);
    },
    [ideaModalShow, setSelectedId]
  );

  const handleDoubleClick = useCallback(
    (e) => {
      if (e.target.className !== "FreeFormIdeas") return;
      e.preventDefault();
      setCoords({ top: e.clientY - canvasOffset, left: e.clientX });
      console.log(ideas)
      setSelectedId(uuidv4());
      setTimeout(ideaModalShow, 300);
    },
    [ideas, ideaModalShow, setSelectedId, canvasOffset]
  );

  const handleIdeaChange = useCallback(
    (idea) => {
      ideaModalHide();
      if (idea.content === "") return;
      if (!idea.ideaId) {
        ideasDispatch({
          type: "createIdea",
          ideaId: selectedId,
          data: update(idea, { $merge: coords }),
        });
        return;
      }
      ideasDispatch({ type: "update", ideaId: selectedId, data: idea });
    },
    [coords, selectedId, ideasDispatch, ideaModalHide]
  );

  const domElementRef = useCallback(
    (domElementReference) => {
      domElement.current = domElementReference;
      updateCanvasOffset();
      drop(domElementReference);
    },
    [drop]
  );

  useEffect(() => {
    window.addEventListener("resize", updateCanvasOffset);
    return () => {
      window.removeEventListener("resize", updateCanvasOffset);
    };
  }, []);

  return (
    <div
      ref={domElementRef}
      className="FreeFormIdeas"
      style={{ background: theme.freeFormIdeasColor }}
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
          selected={idea.ideaId === selectedId}
          onLinkStart={handleLinkStart}
          onLinkEnd={handleLinkEnd}
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
            startId = {selectedId}
            endId = {endId}
            start={calcCoords(selectedIdea, arrowRotationStart)}
            end={calcCoords(ideas[endId], arrowRotationEnd)}
            onLinkAdjust={handleLinkAdjust}
          />
        );
      })}
      {linkingState && (
        <div className="linkingArrow">
          <Arrow
            startId = {selectedId}
            endId = {null}
            start={linkerStart}
            end={linkerEnd}
            onLinkAdjust={handleLinkAdjust}
          />
        </div>
      )}
    </div>
  );
};

export default FreeFormIdeas;
