import React, { useContext } from 'react';
import './App.css';
import Main from './components/Main';
import { useAuth0 } from './contexts/auth0-context';
import { SnackbarProvider } from 'notistack';
import Header from './components/Header';

function App() {
  const { isLoading, user, loginWithRedirect, logout } = useAuth0();

  return (
    <div className="App">
      <SnackbarProvider maxSnack={3}>
        <Header />
        <Main />
        {!isLoading && !user && (
          <>
            <h1>Click Below!</h1>
            <button onClick={loginWithRedirect} className="button is-danger">
              Login
              </button>
          </>
        )}
        {!isLoading && user && (
          <>
            <h1>You are logged in!</h1>
            <p>Hello {user.name}</p>

            {user.picture && <img src={user.picture} alt="My Avatar" />}
            <hr />

            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="button is-small is-dark"
            >
              Logout
                </button>
          </>
        )}
      </SnackbarProvider>
    </div>
  );
}

export default App;
