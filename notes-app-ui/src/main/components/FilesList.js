import React, {Component} from 'react';
import FilePreview from './FilePreview';
import { Link } from 'react-router-dom';
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

    getListItems(){
        return this.state.notes.map(note => <FilePreview {...this.props} key={note.id} note={note}/>)
    }

    render(){
        return (
            this.state.hasError ?
                <div>
                    <p>An Error Occurred Loading This Page, Please Try Again Later</p>
                </div>
                :
                <div>
                    <Link className='block-center' to='/newNote'>New Note</Link>
                    {this.getListItems()}
                </div>
        )
    }
}

export default FilesList;