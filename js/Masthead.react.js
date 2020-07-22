// @flow

const React = require('react');

const Masthead = () => {
  return (
    <div className="masthead">
      <h1><a href="index.html">benhub.io</a></h1>
      <a href="users/index.html">Create User or Log In</a>
      <a href="threads/index.html">Home Thread</a>
      <a href="about/index.html">About</a>
      <a href="blog/index.html">Blog</a>
      <a href="about/index.html">Projects</a>
      <a href="about/index.html">Contact</a>
    </div>
  );
};

module.exports = Masthead;
