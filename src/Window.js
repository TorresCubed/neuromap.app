import React, {useState, useReducer, useCallback } from 'react';
import "./App.css";
import FreeFormIdeas from "./FreeformIdeas";
import OptionBar from "./OptionBar";
import update from "immutability-helper";


  
export const IdeaContext = React.createContext({});

const Window = () => {

  const [selectedIdeaColor, setSelectedIdeaColor] = useState("#FFD700")
  const [freeFormIdeasColor, setFreeFormIdeasColor] = useState("#008080");
  const [selectedId, setSelectedId] = useState("a");

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
              $set: Object.assign(
                { id: action.id, linkList: new Set() },
                action.data
              ),
            },
          });
        case "link":
          return update(state, {
            [action.fromId]: {
              linkList: { $add: [action.toId] },
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
        linkList: new Set("b"),
      },
      b: {
        id: "b",
        top: 180,
        left: 20,
        title: "Great Idea!",
        linkList: new Set(),
      },
    }
  );
  
  


  return (
    <div className="Containment">      
      <IdeaContext.Provider value={
        {
          ideas: ideas,
          ideasDispatch:ideasDispatch,
          selectedId:selectedId,
          setSelectedId:setSelectedId,
          freeFormIdeasColor,
          setFreeFormIdeasColor,
          selectedIdeaColor,
          setSelectedIdeaColor,
          }}>
        <FreeFormIdeas/>
        <OptionBar id="OptionBar"/>
      </IdeaContext.Provider>
    </div>
  );
};

export default Window;
