// @flow

const axios = require('axios');
const React = require('react');
const Button = require('./Button.react');
const TextField = require('./TextField.react');
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

  return (
    <div style={COMPOSER_STYLE}>
      <div style={HEADER_STYLE}>
        Posting as: <b>{username}</b>
      </div>
      <TextField
        style={BODY_STYLE}
        value={comment}
        onChange={setComment}
      />
      <div style={FOOTER_STYLE}>
        <Button
          style={{float: 'right'}}
          disabled={username == null}
          label={username != null ? 'Submit Comment' : 'Must Log In to Comment'}
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
      </div>
    </div>
  );
};

module.exports = Composer;
