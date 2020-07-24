const jwt = require('jsonwebtoken');
const {jwtSecret} = require('./config');
const {selectQuery, updateQuery, upsertQuery} = require('./dbUtils');

const validJWTNeeded = (req, res, next) => {
  if (req.headers['authorization']) {
    try {
      let authorization = req.headers['authorization'].split(' ');
      if (authorization[0] !== 'Bearer') {
        return res.status(401).send({error: 'improper login header'});
      } else {
        req.jwt = jwt.verify(authorization[1], jwtSecret);
        return next();
      }
    } catch (err) {
      return res.status(403).send({error: 'not logged in'});
    }
  } else {
    return res.status(401).send({error: 'improper login header'});
  }
};

const minimumPermissionLevelRequired = (requiredPermissionLevel) => {
  return (req, res, next) => {
    if (requiredPermissionLevel == 0) return next();

    const {username} = req.jwt;
    selectQuery('blog_users', ['username', 'permissionlevel'], {username})
      .then(result => {
        if (result.rows.length == 1) {
          const userPermissionLevel = result.rows[0].permissionlevel;
          if (userPermissionLevel & requiredPermissionLevel) {
            return next();
          } else {
            return res.status(403).send({error: 'you don\'t have this permission'});
          }
        } else {
          res.status(400).send({error: 'No user with this username'});
        }
      });
  };
};

const recordVisit = () => {
  return (req, res, next) => {
    if (req.method != 'GET') {
      next();
      return;
    }
    const pathArr = req.path.split('/');
    if (pathArr[1] == 'index.html') {
      setVisit('benhub');
      setVisit('benhub/home/index.html');
    } else if (
      pathArr.length > 2 && pathArr[pathArr.length - 1].split('.')[1] == 'html'
    ) {
      setVisit('benhub');
      setVisit('benhub' + req.path);
    }
    next();
  };
};

const setVisit = (site) => {
  upsertQuery(
    'visits',
    {
      site: site,
      num_visits: 1,
      last_visited: new Date(),
    },
    {
      num_visits: 'visits.num_visits + 1',
      last_visited: 'current_timestamp',
    },
    {site},
  );
}

module.exports = {
  validJWTNeeded,
  minimumPermissionLevelRequired,
  recordVisit,
};
