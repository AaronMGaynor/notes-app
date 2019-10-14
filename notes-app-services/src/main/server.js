//Express Dependencies
const express = require('express');
const app = express();
const path = require('path');
const parser = require('body-parser');

//GLOBALS
const port = 3001;

//DB Dependencies
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const lodashId = require('lodash-id');

//Express REST Service Setup
function server(dbfile) {
    const adapter = new FileSync(dbfile);
    app.db = low(adapter);

    //DB Setup
    app.db.defaults({notes: []})
        .write();

    lodashId.createId = () => {
        return app.db.get('notes').value().length ? (app.db.get('notes').sortBy('id').last().value().id + 1) : 1;
    };

    app.db._.mixin(lodashId);

    app.use(parser.json());

    app.use(express.static(path.join(__dirname, '../../../notes-app-ui/build')));

    //GET REST endpoint to get all notes
    app.get('/api/v1/notes', (req, res) =>
        res.send(app.db.get('notes').value())
    );

    //PUT REST endpoint to put a note into the database
    app.put('/api/v1/notes', (req, res) => {
            let note = req.body;
            if(note.hasOwnProperty('title') && note.hasOwnProperty('body')) {
                res.send(app.db.get('notes').upsert(note).write());
            } else {
                res.status(406).end();
            }
        }
    );

    //GET REST endpoint to get a specific note, selected by path parameter noteId
    app.get('/api/v1/notes/:noteId', (req, res) => {
            res.send(app.db.get('notes').find({id: Number(req.params.noteId)}).value());
        }
    );

    //DELETE REST endpoint to delete a specific note, selected by path paramtere noteId
    app.delete('/api/v1/notes/:noteId', (req, res) => {
            res.send(app.db.get('notes').removeById(Number(req.params.noteId)).write());
        }
    );

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../../notes-app-ui/build'));
    });

    //Start app listening on designated port
    app.listen(port, () => console.log(`App listening on port ${port}`));

    return app;
}

module.exports = server;
