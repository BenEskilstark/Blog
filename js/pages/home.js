// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const Masthead = require('../Masthead.react');
const Automata = require('../Automata.react');
const {useEffect, useState} = React;

const Main = () => {
  return (
    <div
      style={{
        position: 'fixed',
        overflow: 'hidden',
        margin: '0',
        height: '100%',
      }}
    >
      <Masthead hideLinks={true}/>
      <Automata />
      <div style={{
        position: 'fixed',
        backgroundColor: 'white',
        top: '40%',
        padding: '2px',
        paddingRight: '10px',
        left: '50%',
        borderRadius: '2px',
        boxShadow: 'inset -0.3em -0.3em 0.5em rgba(0,0,0,0.3)',
        fontSize: '2em',
        textAlign: 'center',
        width: 120,
        marginLeft: '-60px',
      }}>
        <div style={{marginLeft: '8px', marginBottom: '8px'}}>
          <a href="blog/index.html">Blog</a></div>
        <div style={{marginLeft: '8px', marginBottom: '8px'}}>
          <a href="about/index.html">About</a></div>
        <div style={{marginLeft: '8px', marginBottom: '8px'}}>
          <a href="projects/index.html">Projects</a></div>
        <div style={{marginLeft: '8px', marginBottom: '8px'}}>
          <a href="contact/index.html">Contact</a></div>
      </div>
    </div>
  );
}

ReactDOM.render(
  <Main />,
  document.getElementById('container'),
);

