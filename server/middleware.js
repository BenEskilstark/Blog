const jwt = require('jsonwebtoken');
const {jwtSecret} = require('./config');;

// -------------------------------------------------------------------------
// Middleware
// -------------------------------------------------------------------------
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

const minimumPermissionLevelRequired = (required_permission_level) => {
 return (req, res, next) => {
   let user_permission_level = parseInt(req.jwt.permission_level);
   let user_id = req.jwt.user_id;
   if (user_permission_level & required_permission_level) {
     return next();
   } else {
     return res.status(403).send({error: 'you don\'t have this permission'});
   }
 };
};

module.exports = {
  validJWTNeeded,
  minimumPermissionLevelRequired,
};
