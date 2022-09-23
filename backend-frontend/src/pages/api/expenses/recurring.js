import { apiHandler, validateCopyRecurring, expenseRepo } from 'src/helpers/api';

export default apiHandler({
  post: copyRecurringToNextMonth,
});

async function copyRecurringToNextMonth(req, res) {
  const { isValid, msg } = validateCopyRecurring(req.body);
  if (!isValid) {
    return res.status(400).json({ message: msg });
  }

  const { year, month, keepAmounts } = req.body;

  try {
    const response = await expenseRepo.copyRecurringToNextMonth(req.auth.sub, year, month, keepAmounts);

    return res.status(200).json(response);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}