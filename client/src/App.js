import React from 'react';
import './App.css';
import { useAuth0 } from '../src/contexts/auth0-context';
import { EntityListProvider } from './contexts/entityContext';
import AppDrawer from './components/Drawer';
import { SnackbarProvider } from 'notistack';

function App() {
  const { isLoading, user, loginWithRedirect } = useAuth0();

  const initialState = {
    entityList: { list: [{}]}
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'update':
        return {
          ...state,
          entityList: action.newEntityList
        };
      default:
        return state;
    }
  };

  if (!isLoading && !user) {
    loginWithRedirect();
  } else {
    return (
      <div className="App">
        <EntityListProvider initialState={initialState} reducer={reducer}>
          <SnackbarProvider maxSnack={3}>
            <AppDrawer />
          </SnackbarProvider>
        </EntityListProvider>
      </div>
    );
  }
}

export default App;
