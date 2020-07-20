// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const Button = require('../components/Button.react');
const Divider = require('../components/Divider.react');
const TextField = require('../components/TextField.react');
const axios = require('axios');
const {useEffect, useState} = React;

const Main = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(null);

  const [createUsername, setCreateUsername] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createMessage, setCreateMessage] = useState(null);

  return (
    <div
      style={{
        margin: 'auto',
        maxWidth: 600,
        textAlign: 'center',
      }}
    >
      <div>
        <h2>Create User:</h2>
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
              .then((res) => setCreateMessage('Successfully created: ' + res.data.username))
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
                // window.accessToken = res.data.accessToken;
                localStorage.setItem('username', username);
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
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

ReactDOM.render(
  <Main />,
  document.getElementById('container'),
);

