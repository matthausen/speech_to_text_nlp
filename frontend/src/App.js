import React from 'react';
import './App.css';
import Main from './components/Main';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <div className="App">
      <SnackbarProvider maxSnack={3}>
        <Main />
      </SnackbarProvider>
    </div>
  );
}

export default App;
