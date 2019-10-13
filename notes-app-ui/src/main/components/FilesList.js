import React, {Component} from 'react';
import '../../css/custom.css';

class FilesList extends Component {

    constructor(props){
        super(props);
        this.state = {
            notes: [],
            hasError: false,
        };
    }

    componentDidMount(){
        this.getNotesList();
    }

    getNotesList(){
        fetch('/api/v1/notes', {
            method: 'GET'
        }).then(response => {
            if(!response.ok){
                throw Error();
            }
            return response.json()
        })
            .then(notes => this.setState({notes}))
            .catch(() => this.setState({hasError: true}))
    }

    deleteNote(noteId){
        fetch(`/api/v1/notes/${noteId}`, {
            method: 'DELETE'
        }).then(response => {
            if(!response.ok){
                throw Error();
            }
            this.getNotesList();
        })
            .catch(() => this.setState({hasError: true}))
    }

    getListItems(){
        return this.state.notes.map(note =>
            <div className={"preview"} key={note.id}>
                <h5>{note.title}</h5>
                <p>{note.body.length > 50 ? note.body.substring(0, 49).concat(' ...') : note.body}</p>
                <button onClick={() => this.props.history.push(`/${note.id}`)}>Edit</button>
                <button onClick={() => this.deleteNote(note.id)}>Delete</button>
            </div>
        )
    }

    redirectTo(location){
        this.props.history.push(location);
    }

    render(){
        return (
            this.state.hasError ?
                <div>
                    <p>An Error Occurred Loading This Page, Please Try Again Later</p>
                </div>
                :
                <div>
                    <button className='stick' onClick={() => this.props.history.push('/newNote')}>New Note</button>
                    {this.getListItems()}
                </div>
        )
    }
}

export default FilesList;