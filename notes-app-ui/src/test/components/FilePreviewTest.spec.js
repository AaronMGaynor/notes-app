import FilePreview from "../../main/components/FilePreview";
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

describe('File Preview Unit Tests', function(){

    describe('Redirect to Note Page', function(){
        let note = {
            id: 1,
            title: 'Test Title',
            body: 'Test Body',
        };
        let redirectURL = '';
        let history = {
            push: (url) => {redirectURL = url}
        };
        it('Redirects to the appropriate note page', function(){
            let wrapper = shallow(<FilePreview history={history} note={note}/>);
            wrapper.update();
            expect(redirectURL).to.equal('');
            wrapper.instance().redirectToNotePage();
            expect(redirectURL).to.equal(`/${note.id}`);
        });
    });

});

describe('File Preview Render Tests', function(){

    describe('Has Body Less than 50 characters', function(){
        let note = {
            id: 1,
            title: 'Test Title',
            body: 'Test Body'
        };

        it('Renders a Preview with Full Body', function(){
           let wrapper = shallow(<FilePreview note={note}/>);
           wrapper.update();
           expect(wrapper.find('h6').text()).to.equal(note.title);
           expect(wrapper.find('p').text()).to.equal(note.body);
        });
    });

    describe('Has Body Greater than 50 characters', function(){
       let note = {
           id: 1,
           title: 'Test Title',
           body: '012345678901234567890123456789012345678901234567890123456789'
       } ;

        it('Renders a Preview with Partial Body Text', function(){
            let wrapper = shallow(<FilePreview note={note}/>);
            wrapper.update();
            expect(wrapper.find('h6').text()).to.equal(note.title);
            expect(wrapper.find('p').text()).to.equal((note.body.substring(0, 49) + ' ...'));
        });
    });
});