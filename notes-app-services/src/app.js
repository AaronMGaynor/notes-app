//Express Dependencies
const express = require('express');
const app = express();
const parser = require('body-parser');


//DB Dependencies
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const lodashId = require('lodash-id');
const adapter = new FileSync('db.json');
const db = low(adapter);

//GLOBALS
const port = 8000;

//DB Setup
lodashId.createId = () => {
    let id = idIncrementer;
    idIncrementer++;
    return id;
};

db._.mixin(lodashId);

console.log(db.defaults({notes: []})
    .write());

console.log(db.get('notes')
    .upsert({id: 1, title: 'Test', body: 'Test Baby Test'})
    .write());

//set idIncrementer to one higher than the current highest id, if no items exist, set idIncrementer to 1
let idIncrementer = db.get('notes').value().length ? (db.get('notes').sortBy('id').last().value().id + 1) : 1;

//Express REST Service Setup
app.use(parser.json());

//GET REST endpoint to get all notes
app.get('/api/v1/notes', (req, res) =>
    res.send(db.get('notes').value())
);

//PUT REST endpoint to put a note into the database
app.put('/api/v1/notes', (req, res) => {
        res.send(db.get('notes').upsert(req.body).write());
    }
);

//GET REST endpoint to get a specific note, selected by path parameter noteId
app.get('/api/v1/notes/:noteId', (req, res) => {
        const note = db.get('notes').find({id: Number(req.params.noteId)}).value();
        res.send(note ? note : `Requested Note ${req.params.noteId} Could Not Be Found`);
    }
);

//DELETE REST endpoint to delete a specific note, selected by path paramtere noteId
app.delete('/api/v1/notes/:noteId', (req, res) => {
        //TODO: MEANINGFUL IMPLEMENTATION
        res.send('DELETED');
    }
);

//Start app listening on designated port
app.listen(port, () => console.log(`App listening on port ${port}`));
