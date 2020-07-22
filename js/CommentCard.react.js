// @flow

const axios = require('axios');
const Button = require('./components/Button.react');
const React = require('react');
const {useState} = React;

export type Props = {
  id: number,
  username: string,
  thread: string,
  comment: string,
  createdat: mixed,
};

const CARD_STYLE = {
  padding: '4px',
  marginBottom: '8px',
  maxWidth: '500px',
};
const HEADER_STYLE = {
  borderBottom: '1px solid black',
};
const BODY_STYLE = {
  padding: '2px',
};

const CommentCard = (props: Props) => {
  const {username, createdat, comment, id} = props;

  const [isDeleted, setDelete] = useState(false);

  let deleteButton = null;
  if (localStorage.getItem('username') == 'admin') {
    deleteButton = (
      <Button
        style={{float: 'right'}}
        label="Delete"
        onClick={() => {
          axios
            .post('delete',
              {id},
              {headers: {authorization: 'Bearer ' + localStorage.getItem('accessToken')}},
            )
            .then((res) => {
              setDelete(true);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      />
    );
  }

  if (isDeleted) return null;

  return (
    <div style={CARD_STYLE} key={username + '_' + comment}>
      <div style={HEADER_STYLE}>
        <b>{username}</b> {new Date(createdat).toDateString()}
        {deleteButton}
      </div>
      <div style={BODY_STYLE}>
        {comment}
      </div>
    </div>
  );
};

module.exports = CommentCard;
