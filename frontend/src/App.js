import React, { useContext } from 'react';
import './App.css';
import Main from './components/Main';
import { SnackbarProvider } from 'notistack';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <SnackbarProvider maxSnack={3}>
        <Header />
        <Main />
      </SnackbarProvider>
    </div>
  );
}

export default App;
