import { apiHandler } from 'src/helpers/api';

export default apiHandler({
  get: getStatus
});

async function getStatus(_req, res) {
  return res.status(200).json({ message: "Ok" });
}