// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const Button = require('./components/Button.react');
const Divider = require('./components/Divider.react');
const TextField = require('./components/TextField.react');
const axios = require('axios');
const {useEffect, useState} = React;

export type Props = {
  login: () => void,
};

const LoginModal = (props: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(null);

  const [createUsername, setCreateUsername] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createMessage, setCreateMessage] = useState(null);


  return (
    <div
      style={{
        position: 'fixed',
        margin: 'auto',
        backgroundColor: 'white',
        maxWidth: 300,
        left: '50%',
        top: '50%',
        marginLeft: '-150px',
        marginTop: '-175px',
        textAlign: 'center',
        padding: '16px',
      }}
    >
      <Button
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        label="X"
        onClick={props.login}
      />
      <div>
        <h2 style={{marginTop: 0}} >Create User:</h2>
        <div>
          Username:
          <TextField
            value={createUsername}
            onChange={setCreateUsername}
          />
        </div>
        <div>
          Password:
          <TextField
            value={createPassword}
            password={true}
            onChange={setCreatePassword}
          />
        </div>
        <div><b>{createMessage}</b></div>
        <Button
          label="Create User"
          onClick={() => {
            axios
              .post('create', {username: createUsername, password: createPassword})
              .then((res) => {
                setCreateMessage('Successfully created: ' + res.data.username);
                setLoginMessage('Logged in as ' + createUsername);
                localStorage.setItem('username', createUsername);
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                props.login();
              })
              .catch((err) => setCreateMessage(err.response.data.error));
          }}
        />
      </div>
      <Divider />
      <div>
        <h2>Login as User:</h2>
        <div>
          Username:
          <TextField
            value={username}
            onChange={setUsername}
          />
        </div>
        <div>
          Password:
          <TextField
            value={password}
            password={true}
            onChange={setPassword}
          />
        </div>
        <div><b>{loginMessage}</b></div>
        <Button
          label="Login"
          onClick={() => {
            axios.post('login', {username, password})
              .then((res) => {
                setLoginMessage('Logged in as ' + username);
                localStorage.setItem('username', username);
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                props.login();
              })
              .catch((err) => {
                if (err && err.response && err.response.data) {
                  setLoginMessage(err.response.data.error);
                }
              });
          }}
        />
      </div>
    </div>
  );
}

module.exports = LoginModal;
