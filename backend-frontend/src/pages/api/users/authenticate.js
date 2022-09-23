const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

import { apiHandler, usersRepo } from 'src/helpers/api';

export default apiHandler({
  post: authenticate
});

async function authenticate(req, res) {
  const { username, password } = req.body;
  const user = await usersRepo.findUser(username);

  // validate
  if (!(user && bcrypt.compareSync(password, user.hash))) {
    return res.status(400).json({ message: 'Username or password is incorrect' });
  }

  // create a jwt token that is valid for 7 days
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  // return basic user details and token
  return res.status(200).json({
    id: user.id,
    username: user.username,
    token
  });
}
