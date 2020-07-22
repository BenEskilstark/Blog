// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const Thread = require('../Thread.react');
const {useEffect, useState} = React;

const Blog = () => {
  return (
    <div
      style={{
        marginBottom: 200,
      }}
    >
      <h2>Comments:</h2>
      <Thread
        cols={75}
        thread={window.location.pathname}
      />
    </div>
  );
}

ReactDOM.render(
  <Blog />,
  document.getElementById('container'),
);

