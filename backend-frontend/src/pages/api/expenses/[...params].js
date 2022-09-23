import { apiHandler, expenseRepo, validateExpense } from 'src/helpers/api';

export default apiHandler({
  get: getExpenses,
  put: putExpense,
  delete: deleteExpense,
});

async function getExpenses(req, res) {
  const { params } = req.query;

  // Validate year - mandatory (2012 <= year < 2050)
  const year = parseInt(params[0]);
  if (isNaN(year) || year < 2012 || year > 2050) return res.status(400).json({ message: "Invalid 'year'. Must be between 2012 and 2050" });

  // Validate month - optional (1 <= month <= 12)
  let month = null;
  if (params.length > 1) {
    month = parseInt(params[1]);
    if (isNaN(month) || month < 1 || month > 12) return res.status(400).json({ message: "Invalid 'month'. Must be between 1 and 12" });
  }

  const response = await expenseRepo.getExpenses(req.auth.sub, null, year, month);

  return res.status(200).json(response);
}

async function putExpense(req, res) {
  const { params } = req.query;

  // Validate expense id - mandatory
  const expenseId = params[0];
  if (isNaN(expenseId) || expenseId <= 0) return res.status(400).json({ message: 'Invalid expense id' });


  // Validate expense body - mandatory
  const expense = req.body;
  const { isValid, msg } = validateExpense(expense);
  if (!isValid) {
    return res.status(400).json({ message: msg });
  }

  const updated = await expenseRepo.updateExpense(req.auth.sub, expenseId, expense);

  // If no expense was updated, return 404
  if (updated.length === 0) return res.status(404).json({ message: `No expense found with id=${expenseId} for this user` });

  const response = updated[0];

  return res.status(200).json(response);
}

async function deleteExpense(req, res) {
  const { params } = req.query;

  // Validate expense id - mandatory
  const expenseId = params[0];
  if (isNaN(expenseId) || expenseId <= 0) return res.status(400).json({ message: 'Invalid expense id' });

  const response = await expenseRepo.deleteExpense(req.auth.sub, expenseId);

  // If no expense was deleted, return 404
  if (response === 0) return res.status(404).json({ message: `No expense found with id=${expenseId} for this user` });

  return res.status(200).json(response);
}