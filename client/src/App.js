import React from 'react';
import './App.css';
import { useAuth0 } from '../src/contexts/auth0-context';
import Main from './components/Main';
import { SnackbarProvider } from 'notistack';
import Header from './components/Header';

function App() {
  const { isLoading, user, loginWithRedirect } = useAuth0();

  if (!isLoading && !user) {
    loginWithRedirect();
  } else {
    return (
      <div className="App">
        <SnackbarProvider maxSnack={3}>
          <Header />
          <Main />
        </SnackbarProvider>
      </div>
    );
  }
}

export default App;
