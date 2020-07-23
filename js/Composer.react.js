// @flow

const axios = require('axios');
const React = require('react');
const Button = require('./components/Button.react');
const TextArea = require('./components/TextArea.react');
const LoginModal = require('./Login.react.js');
const {useEffect, useState} = React;

export type Props = {
  thread: string,
  onSubmit: () => void,
};

const COMPOSER_STYLE = {
  padding: '4px',
  marginBottom: '8px',
  maxWidth: '500px',
};
const HEADER_STYLE = {

};
const BODY_STYLE = {

};
const FOOTER_STYLE = {

};

const Composer = (props: Props): React.Node => {
  const {thread, onSubmit} = props;

  const username = localStorage.getItem('username');

  const [comment, setComment] = useState('');
  const [loginModal, setLoginModal] = useState(null);

  let usernameLabel = (<span>
    Commenting as: <b>{username}</b>
  </span>);
  if (username == null) {
    usernameLabel = (<span>
      Log in or create account to comment
    </span>);
  }

  return (
    <div style={COMPOSER_STYLE}>
      <div style={HEADER_STYLE}>
        {usernameLabel}
      </div>
      <TextArea
        style={BODY_STYLE}
        value={comment}
        onChange={setComment}
      />
      <div style={FOOTER_STYLE}>
        <Button
          style={{
            width: '48%', display: 'inline',
            color: 'rgba(0, 0, 0,' + (username == null ? '0.5' : '0.1') + ')',
          }}
          label="Log in"
          onClick={() => setLoginModal(<LoginModal login={() => setLoginModal(null)}/>)}
        />
        <Button
          style={{
            float: 'right', width: '48%',
            color: 'rgba(0, 0, 0,' + (username != null ? '0.5' : '0.1') + ')',
          }}
          disabled={username == null}
          label={username != null ? 'Submit Comment' : 'Log In to Post'}
          onClick={() => {
            if (comment == '') return;
            axios
              .post('comment',
                {thread, username, comment},
                {headers: {authorization: 'Bearer ' + localStorage.getItem('accessToken')}},
              )
              .then((res) => {
                setComment('');
                onSubmit();
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        />
        {loginModal}
      </div>
    </div>
  );
};

module.exports = Composer;
