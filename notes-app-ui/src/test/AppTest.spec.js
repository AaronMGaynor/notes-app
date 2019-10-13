import React from 'react';
import App from '../main/App';
import { shallow } from 'enzyme';
import { expect } from 'chai';

it('renders without crashing', () => {
  let wrapper = shallow(<App/>);
  expect(wrapper.find('div').length).to.equal(1);
});
