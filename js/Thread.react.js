// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const CommentCard = require('./CommentCard.react');
const Composer = require('./Composer.react');
const {useEffect, useState} = React;

export type Props = {
  thread: string, // name of the thread
};

const Thread = (props: Props) => {
  const {thread} = props;

  const [comments, setComments] = useState([]);
  const [staleCounter, setStale] = useState(0);

  useEffect(() => {
    axios
      .get('thread', {
        params: {thread},
        headers: {authorization: 'Bearer ' + localStorage.getItem('accessToken')},
      })
      .then((res) => {
        res.data.sort((c1, c2) => new Date(c1.createdat) - new Date(c2.createdat));
        setComments(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [staleCounter]);

  return (
    <span>
      {comments.map(c => (<CommentCard {...c} key={c.username + '_' + c.comment} />))}
      <Composer thread={thread} onSubmit={() => setStale(staleCounter + 1)} />
    </span>
  );
}

module.exports = Thread;

