import File from '../../main/components/File';
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';

import fetch from 'node-fetch';
global.Headers = fetch.Headers;

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('File Unit Tests', function(){

    describe('Test Handle Post Save', function(){

        describe('It is an Existing Note', function() {
            let testNoteId = 1;

            let testNote = {
                id: testNoteId,
                title: 'test',
                body: 'test',
            };

            describe('Non-Note Response', function() {

                it('Receives a non-note', function() {
                    fetchMock.get(`/api/v1/notes/${testNoteId}`, testNote);
                    let nonNoteResponse = {
                        message: 'Something Happened'
                    };
                    let wrapper = shallow(<File noteId={testNoteId}/>);

                    setImmediate(() => {
                        wrapper.update();
                        expect(wrapper.state().note.id).to.equal(testNoteId);
                        expect(wrapper.state().note.title).to.equal('test');
                        expect(wrapper.state().note.body).to.equal('test');
                        wrapper.instance().handlePostSave(nonNoteResponse);
                        setImmediate(() => {
                            wrapper.update();
                            expect(wrapper.state().note.title).to.equal('test');
                            expect(wrapper.state().note.body).to.equal('test');
                        });
                    });
                });

                after(() => {
                    fetchMock.restore();
                });

            });

            describe('Note Response', function() {

                it('Receives a note', function() {
                    fetchMock.get(`/api/v1/notes/${testNoteId}`, testNote);
                    let note = {
                        id: 1,
                        title: 'test title',
                        body: 'test body',
                    };
                    let wrapper = shallow(<File noteId={testNoteId}/>);
                    setImmediate(() => {
                        wrapper.update();
                        expect(wrapper.state().note.id).to.equal(testNoteId);
                        expect(wrapper.state().note.title).to.equal('test');
                        expect(wrapper.state().note.body).to.equal('test');
                        wrapper.instance().handlePostSave(note);
                        setImmediate(() => {
                            wrapper.update();
                            expect(wrapper.state().note.id).to.equal(testNoteId);
                            expect(wrapper.state().note.title).to.equal('test title');
                            expect(wrapper.state().note.body).to.equal('test body');
                        });
                    });
                });

                after(() => {
                    fetchMock.restore();
                });

            });
        });


        describe('It is not an Existing Note', function() {
            let redirectURL;
            let history = {
                push: (url) => {redirectURL=url},
            };

            let testNoteId = 'newNote';

            describe('Non-Note Response', function() {
                it('Receives a non-note', function() {
                    let nonNoteResponse = {
                        message: 'Something Happened'
                    };
                    let wrapper = shallow(<File noteId={testNoteId}/>);

                    setImmediate(() => {
                        wrapper.update();
                        expect(wrapper.state().note.title).to.equal('');
                        expect(wrapper.state().note.body).to.equal('');
                        wrapper.instance().handlePostSave(nonNoteResponse);
                        setImmediate(() => {
                            wrapper.update();
                            expect(wrapper.state().note.title).to.equal('');
                            expect(wrapper.state().note.body).to.equal('');
                        });
                    });
                });
            });

            describe('Note Response', function() {
                it('Receives a note', function() {
                    let note = {
                        id: 1,
                        title: 'test title',
                        body: 'test body',
                    };
                    let wrapper = shallow(<File history={history} noteId={testNoteId}/>);
                    setImmediate(() => {
                        wrapper.update();
                        expect(wrapper.state().note.title).to.equal('');
                        expect(wrapper.state().note.body).to.equal('');
                        wrapper.instance().handlePostSave(note);
                        setImmediate(() => {
                            wrapper.update();
                            expect(redirectURL).to.equal('/1')
                        });
                    });
                });
            });

        });

    });

    describe('Test Handle Title Change', function() {
        let event = {
            preventDefault: () => {},
            target: {
                value: 'Test'
            }
        };

        it('Updates State Appropriately', function() {
            let wrapper = shallow(<File noteId={'newNote'}/>);
            wrapper.update();
            expect(wrapper.state().note.title).to.equal('');
            expect(wrapper.state().note.body).to.equal('');
            wrapper.instance().handleTitleChange(event);
            setImmediate(() => {
                wrapper.update();
                expect(wrapper.state().note.title).to.equal('Test');
                expect(wrapper.state().note.body).to.equal('');
            });
        });

    });

    describe('Test Handle Body Change', function() {
        let event = {
            preventDefault: () => {},
            target: {
                value: 'Test'
            }
        };

        it('Updates State Appropriately', function() {
            let wrapper = shallow(<File noteId={'newNote'}/>);
            wrapper.update();
            expect(wrapper.state().note.title).to.equal('');
            expect(wrapper.state().note.body).to.equal('');
            wrapper.instance().handleBodyChange(event);
            setImmediate(() => {
                wrapper.update();
                expect(wrapper.state().note.title).to.equal('');
                expect(wrapper.state().note.body).to.equal('Test');
            });
        });

    });

    describe('Test Get Note Data', function() {

        describe('Note Response', function() {

            it('Puts Note into State', function() {
                let response = {
                    id: 1,
                    title: 'Test Title',
                    body: 'Test Body',
                };
                fetchMock.get('/api/v1/notes/newNote', response);
                let wrapper = shallow(<File noteId={'newNote'}/>);
                setImmediate(() => {
                    wrapper.update();
                    expect(wrapper.state().hasError).to.equal(false);
                    expect(wrapper.state().note.title).to.equal('');
                    expect(wrapper.state().note.body).to.equal('');
                    wrapper.instance().getNoteData();
                    setImmediate(() => {
                        wrapper.update();
                        expect(wrapper.state().hasError).to.equal(false);
                        expect(wrapper.state().note.title).to.equal('Test Title');
                        expect(wrapper.state().note.body).to.equal('Test Body');
                    });
                });
            });

            after(() => {
                fetchMock.restore();
            });

        });

        describe('Erroneous Response', function() {

            it('Sets hasError to true', function() {
                fetchMock.get('/api/v1/notes/newNote', 400);
                let wrapper = shallow(<File noteId={'newNote'}/>);
                setImmediate(() => {
                    wrapper.update();
                    expect(wrapper.state().hasError).to.equal(false);
                    expect(wrapper.state().note.title).to.equal('');
                    expect(wrapper.state().note.body).to.equal('');
                    wrapper.instance().getNoteData();
                    setImmediate(() => {
                        wrapper.update();
                        expect(wrapper.state().hasError).to.equal(true);
                        expect(wrapper.state().note.title).to.equal('');
                        expect(wrapper.state().note.body).to.equal('');
                    });
                });
            });

            after(() => {
                fetchMock.restore();
            });
        });

    });

    describe('Test Save Note Data', function(){

        describe('Note Response', function() {

            it('Puts note into state', function() {
                let note = {
                    id: 1,
                    title: 'title',
                    body: 'body',
                };
                let response = {
                    id: 1,
                    title: 'Test Title',
                    body: 'Test Body',
                };
                fetchMock.get('/api/v1/notes/1', note)
                    .put('/api/v1/notes', response);
                let wrapper = shallow(<File noteId={1}/>);
                expect(wrapper.state().hasError).to.equal(false);
                setImmediate(() => {
                    wrapper.update();
                    expect(wrapper.state().hasError).to.equal(false);
                    expect(wrapper.state().note.title).to.equal('title');
                    expect(wrapper.state().note.body).to.equal('body');
                    wrapper.instance().saveNoteData();
                    setImmediate(() => {
                        wrapper.update();
                        expect(wrapper.state().hasError).to.equal(false);
                        expect(wrapper.state().note.title).to.equal('Test Title');
                        expect(wrapper.state().note.body).to.equal('Test Body');
                    });
                });
            });

            after(() => {
                fetchMock.restore();
            });

        });

        describe('Erroneous Response', function() {

            it('Sets hasError to true', function() {
                let note = {
                    id: 1,
                    title: 'title',
                    body: 'body'
                };
                fetchMock.get('/api/v1/notes/1', note);
                fetchMock.put('/api/v1/notes', 400);
                let wrapper = shallow(<File noteId={1}/>);
                setImmediate(() => {
                    wrapper.update();
                    expect(wrapper.state().hasError).to.equal(false);
                    expect(wrapper.state().note.title).to.equal('title');
                    expect(wrapper.state().note.body).to.equal('body');
                    wrapper.instance().saveNoteData();
                    setImmediate(() => {
                        wrapper.update();
                        expect(wrapper.state().hasError).to.equal(true);
                        expect(wrapper.state().note.title).to.equal('title');
                        expect(wrapper.state().note.body).to.equal('body');
                    });
                });
            });

            after(() => {
                fetchMock.restore();
            });
        });
    });

});

describe('File Render Tests', function(){

    describe('New Note', function(){
        let noteId = 'newNote';

        it('Renders Input fields with no text', function(){
            let wrapper = shallow(<File noteId={noteId}/>);
            wrapper.update();
            expect(wrapper.find('Link').text()).to.equal('Home');
            expect(wrapper.find('input').props().value).to.equal('');
            expect(wrapper.find('textarea').props().value).to.equal('');
            expect(wrapper.find('button').text()).to.equal('Save');
            expect(wrapper.find('p').length).to.equal(0);
        });

    });

    describe('Existing Empty Note', function(){
        let noteId = 1;
        let note = {
            id: 1,
        };

        it('Renders Input fields with no text', function(){
            fetchMock.get(`/api/v1/notes/${noteId}`, note);
            let wrapper = shallow(<File noteId={noteId}/>);
            setImmediate(() => {
                wrapper.update();
                expect(wrapper.find('Link').text()).to.equal('Home');
                expect(wrapper.find('input').props().value).to.equal(note.title);
                expect(wrapper.find('textarea').props().value).to.equal(note.body);
                expect(wrapper.find('button').text()).to.equal('Save');
                expect(wrapper.find('p').length).to.equal(0);
            });
        });

        after(() => {
            fetchMock.reset();
        });
    });

    describe('Existing Note with Value', function(){
        let noteId = 1;
        let note = {
            id: 1,
            title: 'Test Title',
            body: 'Test Body'
        };

        it('Renders Input fields with no text', function(){
            fetchMock.get(`/api/v1/notes/${noteId}`, note);
            let wrapper = shallow(<File noteId={noteId}/>);
            setImmediate(() => {
                wrapper.update();
                expect(wrapper.find('Link').text()).to.equal('Home');
                expect(wrapper.find('input').props().value).to.equal(note.title);
                expect(wrapper.find('textarea').props().value).to.equal(note.body);
                expect(wrapper.find('button').text()).to.equal('Save');
                expect(wrapper.find('p').length).to.equal(0);
            });
        });

        after(() => {
            fetchMock.reset();
        });

    });

    describe('Has Error True', function(){
        let noteId = 1;
        let error = 500;

        it('Renders Error Message', function(){
            fetchMock.get(`/api/v1/notes/${noteId}`, error);
            let wrapper = shallow(<File noteId={noteId}/>);
            setImmediate(() => {
                wrapper.update();
                expect(wrapper.find('Link').text()).to.equal('Home');
                expect(wrapper.find('input').length).to.equal(0);
                expect(wrapper.find('textarea').length).to.equal(0);
                expect(wrapper.find('button').length).to.equal(0);
                expect(wrapper.find('p').text()).to.equal('An Error Occurred Loading This Page, Try Again Later');
            });
        });

        after(() => {
            fetchMock.reset();
        })
    })
});