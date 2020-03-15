import React, { createContext, useContext, useReducer } from 'react';

// create the context
export const EntityContext = createContext();

export const useEntityValue = () => useContext(EntityContext);

// create a provider
export const EntityListProvider = ({ reducer, initialState, children }) => (
  <EntityContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </EntityContext.Provider>
)