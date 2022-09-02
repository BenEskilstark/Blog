
const express = require('express')
const {
  writeQuery, selectQuery, updateQuery,
  deleteQuery,
} = require('./dbUtils');
const {
  validJWTNeeded,
  minimumPermissionLevelRequired,
  recordVisit,
} = require('./middleware');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('./config');;
const urlParser = require('url');

const port = process.env.PORT || 8000;

process.on('uncaughtException', function (err) {
      console.log(err);
});

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

  writeQuery('blog_users', {username, password, permissionLevel: 1, numlogins: 1})
    .then(() => {
      res.status(201).send(getTokens(req));
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

const deleteComment = (req, res) => {
  const {id} = req.body;
  deleteQuery('blog_comments', {id})
    .then((result) => res.status(201).send({}))
    .catch((err) => {
      res.status(500).send({error: 'couldn\'t delete comment'});
    });
}

comments.get('/thread', [
  // validJWTNeeded,
  // minimumPermissionLevelRequired(0),
  getCommentThread,
]);
comments.post('/comment', [
  validJWTNeeded,
  minimumPermissionLevelRequired(0),
  postComment,
]);
comments.post('/delete', [
  validJWTNeeded,
  minimumPermissionLevelRequired(7),
  deleteComment,
]);

// -------------------------------------------------------------------------
// Blog
// -------------------------------------------------------------------------
const blog = express();

// force https redirect, and don't try to record site visits in prod
if (port != 8000) {
  blog.use(recordVisit());
  blog.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`)
    } else {
      next()
    }
  })
}

blog.use(express.static('home'));
blog.use('/blog', users);
blog.use(['/blog', '/threads'], comments);
console.log("server listening on port", port);
blog.listen(port);
