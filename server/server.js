
const express = require('express')
const {
  writeQuery, selectQuery, updateQuery,
} = require('./dbUtils');
const {
  validJWTNeeded,
  minimumPermissionLevelRequired,
} = require('./middleware');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('./config');;
const urlParser = require('url');

const port = process.env.PORT || 8000;

// -------------------------------------------------------------------------
// Users
// -------------------------------------------------------------------------
const users = express();
users.use(express.json());
users.use(express.urlencoded({ extended: false }));

users.post('/create', (req, res) => {
  const salt = crypto.randomBytes(16).toString('base64');
  const hash = crypto.createHmac('sha512',salt)
    .update(req.body.password).digest("base64");
  req.body.password = salt + "$" + hash;
  const {username, password} = req.body;

  writeQuery('blog_users', {username, password, permissionLevel: 1})
    .then(() => {
      res.status(201).send({username});
    })
    .catch((err) => {
      res.status(500).send({error: 'failed to create user (probably duplicate username)'});
    });
});

users.post('/login', (req, res) => {
  const {username} = req.body;

  selectQuery('blog_users', ['username', 'password'], {username})
    .then(result => {
      if (result.rows.length == 1) {
        const user = result.rows[0];
        const passwordFields = user.password.split('$');
        const salt = passwordFields[0];
        const hash = crypto.createHmac('sha512', salt)
          .update(req.body.password).digest("base64");
        if (hash == passwordFields[1]) {
          updateQuery('blog_users',
            {numlogins: 'numlogins + 1', lastlogin: 'current_timestamp'},
            {username},
          );
          res.status(201).send(getTokens(req));
        } else {
          res.status(400).send({error: 'Incorrect password'});
        }
        return res;
      } else {
        res.status(400).send({error: 'No user with this username'});
      }
    })
    .catch((err) => {
      res.status(500).send({error: 'Unknown login error :('});
    });
});

const getTokens = (req) => {
  const refreshId = req.body.username + jwtSecret;
  const salt = crypto.randomBytes(16).toString('base64');
  const hash = crypto.createHmac('sha512', salt)
    .update(refreshId).digest("base64");
  req.body.refreshKey = salt;
  const accessToken = jwt.sign(req.body, jwtSecret);
  const b = new Buffer.from(hash);
  const refreshToken = b.toString('base64');
  return {accessToken, refreshToken};
}

// -------------------------------------------------------------------------
// Comments
// -------------------------------------------------------------------------
const comments = express();
comments.use(express.json());
comments.use(express.urlencoded({ extended: false }));

const getCommentThread = (req, res) => {
  const query = urlParser.parse(decodeURIComponent(req.url), true).query;
  selectQuery('blog_comments', ['id', 'username', 'comment', 'createdat'], query)
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({error: 'couldn\'t fetch thread'});
    });
};

const postComment = (req, res) => {
  const {username, thread, comment} = req.body;
  writeQuery('blog_comments', {username, thread, comment})
    .then((result) => res.status(201).send({}))
    .catch((err) => {
      res.status(500).send({error: 'couldn\'t post comment'});
    });
}

comments.get('/thread', [
  // validJWTNeeded,
  // minimumPermissionLevelRequired(0),
  getCommentThread,
]);
comments.post('/thread', [
  validJWTNeeded,
  // minimumPermissionLevelRequired(0),
  postComment,
]);

// -------------------------------------------------------------------------
// Blog
// -------------------------------------------------------------------------
const blog = express();
blog.use(express.static('home'));
blog.use('/users', users);
blog.use('/comments', comments);
console.log("server listening on port", port);
blog.listen(port);
