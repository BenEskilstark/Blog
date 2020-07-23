// @flow

const React = require('react');

export type Props = {
  hideLinks: ?boolean,
};

// TODO: masthead should take prop for href relative to
const Masthead = (props: Props) => {
  const links = (
    <div>
      <a href="about/index.html">About</a>
      <a href="blog/index.html">Blog</a>
      <a href="projects/index.html">Projects</a>
      <a href="contact/index.html">Contact</a>
    </div>
  );
  return (
    <div className="masthead">
      <h1><a href="index.html">benhub.io</a></h1>
      {props.hideLinks ? null : links}
    </div>
  );
};

module.exports = Masthead;
