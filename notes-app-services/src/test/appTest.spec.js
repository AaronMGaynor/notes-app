const request = require('supertest');
const expect = require('chai').expect;
let server = require('../main/server');

describe('Test', function(){
    let app = server('test.db.json');
    let notes = [
        {
            id: 1,
            title: 'Test',
            body: 'Test Body',
        },
        {
            id: 2,
            title: 'Test 2',
            body: 'Test Body 2',
        },
    ];

    beforeEach((done) => {
        app.db.setState({notes: notes.slice()});
        app.db.write();
        done();
    });

    it('Returns Notes', function(done){
        request(app)
            .get('/api/v1/notes')
            .expect(200)
            .end(function(err, res){
                expect(res.body.length).to.equal(notes.length);
                notes.map((note, index) => {
                    expect(res.body[index].id).to.equal(note.id);
                    expect(res.body[index].title).to.equal(note.title);
                    expect(res.body[index].body).to.equal(note.body);
                });
                done(err);
            });
    });

    it('Saves Note', function(done){
        let postNote = {
            id: 3,
            title: 'Test 3',
            body: 'Test Body 3'
        };
       request(app)
           .put('/api/v1/notes')
           .send(postNote)
           .expect(200)
           .end(function(err, res){
               expect(res.body.id).to.equal(3);
               expect(res.body.title).to.equal('Test 3');
               expect(res.body.body).to.equal('Test Body 3');
               expect(app.db.getState().notes.length).to.equal(3);
               done(err);
           })
    });

    it('Saves Note and Creates id for Note', function(done){
        let postNote = {
            title: 'Test 3',
            body: 'Test Body 3'
        };
        request(app)
            .put('/api/v1/notes')
            .send(postNote)
            .expect(200)
            .end(function(err, res){
                expect(res.body.id).to.equal(3);
                expect(res.body.title).to.equal('Test 3');
                expect(res.body.body).to.equal('Test Body 3');
                expect(app.db.getState().notes.length).to.equal(3);
                done(err);
            })
    });

    it('Returns 406 When Note has no Title', function(done){
        let postNote = {
            id: 3,
            body: 'Test Body'
        };
        request(app)
            .put('/api/v1/notes')
            .send(postNote)
            .expect(406, done)
    });

    it('Returns 406 When Note has no Body', function(done){
        let postNote = {
            id: 3,
            title: 'Test Title'
        };
        request(app)
            .put('/api/v1/notes')
            .send(postNote)
            .expect(406, done)
    });

    it('Gets Note By Id', (done) => {
        request(app)
            .get('/api/v1/notes/1')
            .expect(200)
            .end(function(err, res){
                expect(res.body.id).to.equal(1);
                expect(res.body.title).to.equal('Test');
                expect(res.body.body).to.equal('Test Body');
                done(err);
            })
    });

    it('Deletes Note By Id', (done) => {
        request(app)
            .delete('/api/v1/notes/1')
            .expect(200)
            .end(function(err, res){
                expect(res.body.id).to.equal(1);
                expect(res.body.title).to.equal('Test');
                expect(res.body.body).to.equal('Test Body');
                expect(app.db.getState().notes.length).to.equal(1);
                done(err);
            });
    });

    afterEach((done) => {
        app.db.setState({notes: []});
        app.db.write();
        done();
    })

});