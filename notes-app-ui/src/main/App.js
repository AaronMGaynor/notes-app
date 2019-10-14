import '@babel/polyfill';
import React from 'react';
import '../css/App.css';
import FilesList from './components/FilesList';
import {HashRouter, Route} from 'react-router-dom';
import File from './components/File';

function App() {
  return (
    <div className='App'>
        <HashRouter>
            <Route path='/' exact={true} render={(props) => ( <FilesList {...props}/> )}/>
            <Route path='/:noteId' render={(props) => (<File {...props} key={props.match.params.noteId}
                                                             noteId={props.match.params.noteId}/>)}/>
        </HashRouter>
    </div>
  );
}

export default App;
