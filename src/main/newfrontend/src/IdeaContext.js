import React, { useEffect, useReducer, useState } from "react";
import update from "immutability-helper";
import axios from "axios";

function reducer(state, action) {
      switch (action.type) {
        case "update":
          axios.put(`http://localHost:9999/api/v1/ideas/${action.ideaId}`, 
            action.data,          
            {headers: {"Content-Type": "application/json"}}
          ).then()
          return update(state, {
            [action.ideaId]: {
              $merge: action.data,
            },
          });
        case "updateSize":
          return update(state, {
            [action.ideaId]: {
              $merge: action.data,
            },
          });
        case "createIdea":
          axios.post("http://localHost:9999/api/v1/ideas", 
                    Object.assign({
                      ideaId:action.ideaId,linkList: []}, action.data)
          ).then()
          return update(state, {
            [action.ideaId]: {
              $set: Object.assign(
                { ideaId: action.ideaId, linkList: new Set() },
                action.data
              ),
            },
          });
        case "createLink":
          axios.put(`http://localHost:9999/api/v1/ideas/${action.fromId}`, 
            {newLink:action.toId},          
            {headers: {"Content-Type": "application/json"}}
          ).then()
          return update(state, {
            [action.fromId]: {
              linkList: { $add: [action.toId] },
            },
          });
        case "deleteIdea":
          axios.delete(`http://localHost:9999/api/v1/ideas/${action.deleteId}`)
          .then()
          return update(state, 
            {$unset: [action.deleteId]}
          )
        case "deleteLink":
          axios.put(`http://localHost:9999/api/v1/ideas/${action.ideaId}`, 
            {removeLink:action.linkToRemove},          
            {headers: {"Content-Type": "application/json"}}
          ).then()
          return update(state, {
            [action.ideaId]: {
              linkList: 
                {$remove: [action.linkToRemove]}
            }
          });
        case "initialIdeas":
            return update(state, {
              $set:action.data
            });
        default:
          throw new Error(`Unexpected action type: ${action.type}`);
      }
    }

export function useIdeaManager() {
  const [selectedId, setSelectedId] = useState("a");

  const [ideas, ideasDispatch] = useReducer(reducer, {});
  
  useEffect(() => {
    const ideasImport = {};
    axios.get("http://localHost:9999/api/v1/ideas").then(
      res =>{
        res.data.forEach(element => {
        element.linkList = new Set(element.linkList.map(a=>a.toId))
        ideasImport[element.ideaId] = element;
      });
      
        ideasDispatch({
          type: "initialIdeas",
          data: ideasImport
        });
      }
    )
    
  }, [])

  return {
    ideas: ideas,
    ideasDispatch: ideasDispatch,
    selectedId: selectedId,
    setSelectedId: setSelectedId,
  };
}

export const IdeaContext = React.createContext();
