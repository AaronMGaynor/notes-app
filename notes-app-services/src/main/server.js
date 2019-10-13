//Express Dependencies
const express = require('express');
const app = express();
const parser = require('body-parser');


//DB Dependencies
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const lodashId = require('lodash-id');

//Express REST Service Setup
function server(dbfile) {
    const adapter = new FileSync(dbfile);
    app.db = low(adapter);

    //GLOBALS
    const port = 8000;

    //DB Setup
    app.db.defaults({notes: []})
        .write();

    //set idIncrementer to one higher than the current highest id, if no items exist, set idIncrementer to 1
    let idIncrementer = app.db.get('notes').value().length ? (app.db.get('notes').sortBy('id').last().value().id + 1) : 1;

    lodashId.createId = () => {
        let id = idIncrementer;
        idIncrementer++;
        return id;
    };

    app.db._.mixin(lodashId);

    app.use(parser.json());

    //GET REST endpoint to get all notes
    app.get('/api/v1/notes', (req, res) =>
        res.send(app.db.get('notes').value())
    );

    //PUT REST endpoint to put a note into the database
    app.put('/api/v1/notes', (req, res) => {
            res.send(app.db.get('notes').upsert(req.body).write());
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

    //Start app listening on designated port
    app.listen(port, () => console.log(`App listening on port ${port}`));

    return app;
}

module.exports = server;
