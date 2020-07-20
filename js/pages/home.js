// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const {useEffect, useState} = React;

const Main = () => {

  // useEffect(() => {
  //   axios
  //     .get('comments/thread', {
  //       params: {thread: 'home'},
  //       headers: {authorization: 'Bearer ' + localStorage.getItem('accessToken')},
  //     })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // });
  // useEffect(() => {
  //   axios.post('comments/thread',
  //       {thread: 'home', username: 'bre', comment: 'shitpost'},
  //       {headers: {authorization: 'Bearer ' + localStorage.getItem('accessToken')}},
  //     )
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // });
  return (
    <span>
      <div>
        <a href="users/index.html">Create User or Log In</a>
      </div>
      <div>
        <a href="threads/index.html">Home Thread</a>
      </div>
      <div>
        <a href="about/index.html">About</a>
      </div>
    </span>
  );
}

ReactDOM.render(
  <Main />,
  document.getElementById('container'),
);

