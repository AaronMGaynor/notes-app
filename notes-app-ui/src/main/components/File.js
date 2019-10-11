import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import '../../css/custom.css';

class File extends Component {

    constructor(props){
        super(props);
        this.state = {
            note: {
                title: '',
                body: '',
            }
        };
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleBodyChange = this.handleBodyChange.bind(this);
        this.saveNoteData = this.saveNoteData.bind(this);
    }

    componentDidMount(){
        console.log(this.props);
        if(this.props.noteId !== "newNote") {
            this.getNoteData();
        }
    }

    getNoteData(){
        fetch(`/api/v1/notes/${this.props.noteId}`, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(note => this.setState({note}))
    }

    saveNoteData(){
        let head = new Headers();
        head.append('Content-Type', 'application/json');
        fetch('/api/v1/notes', {
            method: 'PUT',
            headers: head,
            body: JSON.stringify(this.state.note)
        }).then(response => response.json())
            .then(json => this.handlePostSave(json))
    }

    handlePostSave(note){
        console.log(note);
        console.log(note.hasOwnProperty("id"));
        if(note.hasOwnProperty("id")) {
            this.props.noteId === "newNote" ?
                this.props.history.push(`/${note.id}`)
                :
                this.setState({
                    note
                });
        }
    }

    handleTitleChange(event){
        event.preventDefault();
        let note = this.state.note;
        note.title = event.target.value;
        this.setState({
            note
        })
    }

    handleBodyChange(event){
        event.preventDefault();
        let note = this.state.note;
        note.body = event.target.value;
        this.setState({
            note
        })
    }

    render(){
        return(
            <div>
                <Link to="/">Home</Link>
                <form onSubmit={this.saveNoteData}>
                    <input className="block-center" type={"text"} placeholder={"Title"} value={this.state.note.title} onChange={this.handleTitleChange}/>
                    <textarea className="block-center" placeholder={"Input Notes Here"} value={this.state.note.body} onChange={this.handleBodyChange}/>
                    <button className="block-center" type={"submit"} value={"Save"}>Save</button>
                </form>
            </div>
        )
    }
}

export default File;