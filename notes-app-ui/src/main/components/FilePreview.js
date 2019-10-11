import React, {Component} from 'react';

class FilePreview extends Component {

    constructor(props){
        super(props);
        this.redirectToNotePage = this.redirectToNotePage.bind(this);
    }

    redirectToNotePage(){
        this.props.history.push(`/${this.props.noteId}`)
    }

    render(){
        return(
            <button className="block-center" onClick={this.redirectToNotePage}>
                <h6>{this.props.title}</h6>
                <p>{this.props.body}</p>
            </button>
        )
    }
}

export default FilePreview;