import React, {Component} from 'react';
import '../../css/custom.css';

class File extends Component {

    constructor(props){
        super(props);
        this.state = {
            note: {
                title: '',
                body: '',
            },
            hasError: false,
        };
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleBodyChange = this.handleBodyChange.bind(this);
        this.saveNoteData = this.saveNoteData.bind(this);
    }

    componentDidMount(){
        if(this.props.noteId !== 'newNote') {
            this.getNoteData();
        }
    }

    getNoteData(){
        fetch(`/api/v1/notes/${this.props.noteId}`, {
            method: 'GET'
        })
            .then(response => {
                if(!response.ok){
                    throw Error()
                }
                return response.json()
            })
            .then(note => this.setState({note}))
            .catch(error => this.setState({hasError: true}))
    }

    saveNoteData(){
        let head = new Headers();
        head.append('Content-Type', 'application/json');
        fetch('/api/v1/notes', {
            method: 'PUT',
            headers: head,
            body: JSON.stringify(this.state.note)
        }).then(response => {
            if(!response.ok){
                throw Error()
            }
            return response.json()
        })
            .then(json => this.handlePostSave(json))
            .catch(error => this.setState({hasError: true}))
    }

    handlePostSave(note){
        if(note.hasOwnProperty('id')) {
            this.props.noteId === 'newNote' ?
                this.props.history.push(`/${note.id}`)
                :
                this.setState({
                    note
                });
        } else {
            this.setState({hasError: true})
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
                <button className='stick' onClick={() => this.props.history.push('/')}>Home</button>
                { this.state.hasError ?
                    <p>An Error Occurred Loading This Page, Try Again Later</p>
                    :
                    <form className='note-create' onSubmit={this.saveNoteData}>
                        <input id={'title'} type={'text'} placeholder={'Title'}
                               value={this.state.note.title} onChange={this.handleTitleChange}/>
                        <textarea id={'body'} placeholder={'Input Notes Here'} value={this.state.note.body}
                                  onChange={this.handleBodyChange}/>
                        <button type={'submit'} value={'Save'}>Save</button>
                    </form>
                }
            </div>
        )
    }
}

export default File;