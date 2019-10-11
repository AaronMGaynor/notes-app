import React, {Component} from 'react';
import FilePreview from './FilePreview';
import { Link } from 'react-router-dom';
import '../../css/custom.css';

class FilesList extends Component {

    constructor(props){
        super(props);
        this.state = {
            notes: []
        }
    }

    componentDidMount(){
        this.getNotesList();
    }

    getNotesList(){
        fetch('/api/v1/notes', {
            method: 'GET'
        }).then(response => response.json())
            .then(notes => this.setState({notes}))
    }

    getListItems(){
        return this.state.notes.map(note => <FilePreview {...this.props} key={note.id} noteId={note.id} title={note.title} body={note.body}/>)
    }

    render(){
        return (
            <div>
                <Link className="block-center" to="/newNote">New Note</Link>
                {this.getListItems()}
            </div>
        )
    }
}

export default FilesList;