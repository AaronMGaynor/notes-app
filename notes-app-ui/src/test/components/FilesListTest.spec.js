import FilesList from "../../main/components/FilesList";
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';

import fetch from 'node-fetch';
global.Headers = fetch.Headers;

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


describe('Files List Unit Tests', function(){

    describe('Test Get Notes List', function(){

        let initalResponse = [];

        describe('Gets List of Notes Response', function(){
            let secondaryResponse = [
                {
                    id: 1,
                    title: 'Title 1',
                    body: 'Body 1'
                },
                {
                    id: 2,
                    title: 'Title 2',
                    body: 'Body 2'
                }
            ];

            it('Places Notes into State', function(){
                fetchMock.get('/api/v1/notes', initalResponse);
                let wrapper = shallow(<FilesList />);
                setImmediate(() => {
                    wrapper.update();
                    expect(wrapper.state().notes.length).to.equal(initalResponse.length);
                    expect(wrapper.state().hasError).to.equal(false);
                    fetchMock.reset();
                    fetchMock.get('/api/v1/notes', secondaryResponse);
                    wrapper.instance().getNotesList();
                    setImmediate(() => {
                        expect(wrapper.state().notes.length).to.equal(secondaryResponse.length);
                        secondaryResponse.map((note, index) => {
                            expect(wrapper.state().notes[index].id).to.equal(note.id);
                            expect(wrapper.state().notes[index].title).to.equal(note.title);
                            expect(wrapper.state().notes[index].body).to.equal(note.body);
                        });
                        expect(wrapper.state().hasError).to.equal(false);
                    })
                })
            });

            after(() => {
                fetchMock.reset();
            });

        });

        describe('Gets Erroneous Response', function(){
            let secondaryResponse = 404;

            it('Sets hasError to true', function(){
                fetchMock.get('/api/v1/notes', initalResponse);
                let wrapper = shallow(<FilesList />);
                setImmediate(() => {
                    wrapper.update();
                    expect(wrapper.state().notes.length).to.equal(initalResponse.length);
                    expect(wrapper.state().hasError).to.equal(false);
                    fetchMock.reset();
                    fetchMock.get('/api/v1/notes', secondaryResponse);
                    wrapper.instance().getNotesList();
                    setImmediate(() => {
                        expect(wrapper.state().notes.length).to.equal(initalResponse.length);
                        expect(wrapper.state().hasError).to.equal(true);
                    })
                })
            });

            after(() => {
                fetchMock.reset();
            });
        });

    });

    describe('Test Get List Items', function(){

        describe('Gets Empty Notes List Response', function(){
            let notesResponse = [];

            it('Returns No Elements', function(){
               fetchMock.get('/api/v1/notes', notesResponse);
               let wrapper = shallow(<FilesList/>);
               setImmediate(() => {
                   expect(wrapper.state().notes.length).to.equal(0);
                   let previewElements = wrapper.instance().getListItems();
                   expect(previewElements.length).to.equal(0);
               });
            });

            after(() => {
                fetchMock.reset();
            });

        });

        describe('Gets Populated Notes List Response', function(){
            let notesResponse= [
                {
                    id: 1,
                    title: 'Title Test',
                    body: 'Body Test',
                },
                {
                    id: 2,
                    title: 'Title Test 2',
                    body: 'Body Test 2',
                }
            ];

            it('Returns Elements For Each Note', function(){
                fetchMock.get('/api/v1/notes', notesResponse);
                let wrapper = shallow(<FilesList/>);
                setImmediate(() => {
                    expect(wrapper.state().notes.length).to.equal(notesResponse.length);
                    let previewElements = wrapper.instance().getListItems();
                    expect(previewElements.length).to.equal(notesResponse.length);
                    notesResponse.map((note, index) => {
                        expect(previewElements[index].key).to.equal(note.id.toString());
                    });
                });
            });

            after(() => {
                fetchMock.reset();
            });

        });

    });

    describe('Test Delete Note', function(){

        let notes = [
            {
                id: 1,
                title: 'Test Title',
                body: 'Test Body'
            }
        ];

        describe('Gets Successful Response', function(){

            it('Calls Get Files List', function(){
                fetchMock.get('/api/v1/notes', notes);
                fetchMock.delete(`/api/v1/notes/${notes[0].id}`, 200);
                let wrapper = shallow(<FilesList />);
                setImmediate(() => {
                    wrapper.update();
                    wrapper.instance().deleteNote(notes[0].id);
                    setImmediate(() => {
                        expect(fetchMock.calls(`/api/v1/notes/${notes[0].id}`).length).to.equal(1);
                        expect(fetchMock.calls('/api/v1/notes').length).to.equal(2);
                    });
                });
            });

            after(() => {
                fetchMock.reset();
            });

        });

        describe('Gets Erroneous Response', function(){

            it('Sets hasError to true', function(){
                fetchMock.get('/api/v1/notes', notes);
                fetchMock.delete(`/api/v1/notes/${notes[0].id}`, 404);
                let wrapper = shallow(<FilesList />);
                setImmediate(() => {
                    wrapper.update();
                    wrapper.instance().deleteNote(notes[0].id);
                    setImmediate(() => {
                        wrapper.update();
                        expect(fetchMock.calls(`/api/v1/notes/${notes[0].id}`).length).to.equal(1);
                        expect(fetchMock.calls('/api/v1/notes').length).to.equal(1);
                        expect(wrapper.state().hasError).to.equal(true);
                    });
                });
            });

            after(() => {
                fetchMock.reset();
            });

        });

    });

});

describe('Files List Render Tests', function(){

    describe('Empty Notes List', function(){
        let notes = [];

        it('Renders Files List with No Entries', function(){
            fetchMock.get('/api/v1/notes', notes);
            let wrapper = shallow(<FilesList/>);
            setImmediate(() => {
                wrapper.update();
                expect(wrapper.find('button').text()).to.equal('New Note');
                expect(wrapper.find('.preview').length).to.equal(0);
                expect(wrapper.find('p').length).to.equal(0);
            });
        });

        after(() => {
            fetchMock.reset();
        });
    });

    describe('Populated Notes List', function(){
        let notes = [
            {
                id: 1,
                title: 'Test Title',
                body: 'Test Body'
            }
        ];

        it('Renders Files List with Entries', function(){
            fetchMock.get('/api/v1/notes', notes);
            let wrapper = shallow(<FilesList/>);
            setImmediate(() => {
                wrapper.update();
                expect(wrapper.find('button').at(0).text()).to.equal('New Note');
                expect(wrapper.find('.preview').length).to.equal(1);
                expect(wrapper.find('p').text()).to.equal(notes[0].body);
            });
        });

        after(() => {
            fetchMock.reset();
        });
    });

    describe('Has Error True', function(){
       let error = 500;

        it('Renders Error Message', function(){
            fetchMock.get('/api/v1/notes', error);
            let wrapper = shallow(<FilesList/>);
            setImmediate(() => {
                wrapper.update();
                expect(wrapper.find('button').length).to.equal(0);
                expect(wrapper.find('FilePreview').length).to.equal(0);
                expect(wrapper.find('p').text()).to.equal('An Error Occurred Loading This Page, Please Try Again Later');
            });
        });

        after(() => {
            fetchMock.reset();
        });

    });

});