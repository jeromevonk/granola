const { expressjwt: jwt } = require("express-jwt");
const util = require('util');

export { jwtMiddleware };

function jwtMiddleware(req, res) {
  const middleware = jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({
    path: [
      // public routes that don't require authentication
      '/api/users/register',
      '/api/users/authenticate',
      '/api/status'
    ]
  });

  return util.promisify(middleware)(req, res);
}