import React, {Component} from 'react';

class FilePreview extends Component {

    constructor(props){
        super(props);
        this.redirectToNotePage = this.redirectToNotePage.bind(this);
    }

    redirectToNotePage(){
        this.props.history.push(`/${this.props.note.id}`)
    }

    render(){
        return(
            <button className='block-center' onClick={this.redirectToNotePage}>
                <h6>{this.props.note.title}</h6>
                <p>{this.props.note.body.length > 50 ? this.props.note.body.substring(0, 49).concat(' ...') : this.props.note.body}</p>
            </button>
        )
    }
}

export default FilePreview;