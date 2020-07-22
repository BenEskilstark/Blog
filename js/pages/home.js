// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const Masthead = require('../Masthead.react');
const {useEffect, useState} = React;

const Main = () => {
  return (
    <span>
      <Masthead />
      <div>
        <a href="users/index.html">Create User or Log In</a>
      </div>
      <div>
        <a href="threads/index.html">Home Thread</a>
      </div>
      <div>
        <a href="about/index.html">About</a>
      </div>
      <div>
        <a href="about/index.html">Blog</a>
      </div>
      <div>
        <a href="about/index.html">Projects</a>
      </div>
    </span>
  );
}

ReactDOM.render(
  <Main />,
  document.getElementById('container'),
);

