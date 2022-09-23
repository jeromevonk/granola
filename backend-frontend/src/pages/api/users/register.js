const bcrypt = require('bcryptjs');

import { apiHandler, usersRepo } from 'src/helpers/api';

export default apiHandler({
  post: register
});

async function register(req, res) {
  // split out password from user details
  const { password, ...user } = req.body;

  // validate
  if (await usersRepo.findUser(user.username)) {
    return res.status(400).json({ message: `User with the username "${user.username}" already exists` });
  }

  // hash password
  user.hash = bcrypt.hashSync(password, 10);

  usersRepo.createUser(user);
  return res.status(200).json({});
}
