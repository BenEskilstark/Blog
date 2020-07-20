// @flow

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const CommentCard = require('../components/CommentCard.react');
const Composer = require('../components/Composer.react');
const {useEffect, useState} = React;

export type Props = {
  thread: string, // name of the thread
};

const Thread = (props: Props) => {

  const [comments, setComments] = useState([]);
  const [staleCounter, setStale] = useState(0);

  useEffect(() => {
    axios
      .get('thread', {
        params: {thread: 'home'},
        // headers: {authorization: 'Bearer ' + localStorage.getItem('accessToken')},
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
      <Composer thread={'home'} onSubmit={() => setStale(staleCounter + 1)} />
    </span>
  );
}

ReactDOM.render(
  <Thread />,
  document.getElementById('container'),
);

