import { apiHandler, expenseRepo } from 'src/helpers/api';

export default apiHandler({
  get: getYears,
});

async function getYears(req, res) {

  try {
    const response = await expenseRepo.getYears(req.auth.sub);

    return res.status(200).json(response);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}