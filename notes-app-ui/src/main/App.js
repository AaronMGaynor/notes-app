import React from 'react';
import '../css/App.css';
import FilesList from './components/FilesList';
import {BrowserRouter} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FilesList/>
      </header>
      <BrowserRouter>

      </BrowserRouter>
    </div>
  );
}

export default App;
