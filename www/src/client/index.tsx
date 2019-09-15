// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Root} from './Root.react';

let root = document.getElementById('root');
const render = root != null ? ReactDOM.hydrate : ReactDOM.render;
if (root == null) {
  root = document.createElement('div');
  document.body.appendChild(root);
}

render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>,
  root,
);
