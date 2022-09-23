const bcrypt = require('bcryptjs');

import { apiHandler, usersRepo } from 'src/helpers/api';

export default apiHandler({
  delete: deleteUser
});

async function deleteUser(req, res) {
  try {
    const response = await usersRepo.deleteUser(req.auth.sub);

    return res.status(200).json(response);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
