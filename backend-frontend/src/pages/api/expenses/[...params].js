import { apiHandler, expenseRepo, validateExpense, convertToCamelCase } from 'src/helpers/api';

export default apiHandler({
  get: getExpenses,
  put: putExpense,
  delete: deleteExpense,
});

async function getExpenses(req, res) {
  const { params, search } = req.query;
  
  // Validate year - mandatory (2012 <= year < 2050)
  const year = params[0];
  if ( year < 2012 || year > 2050) return res.status(400).json({error: 'Invalid year'});

  // Validate month - optional (1 <= month <= 12)
  let month = null;
  if (params.length > 1) {
    month = params[1];
    if ( month < 1 || month > 12) return res.status(400).json({error: 'Invalid month'});
  }

  const response = await expenseRepo.getExpenses(req.auth.sub, null, search, year, month);
    
  return res.status(200).json(response);
}

async function putExpense(req, res) {
  const { params } = req.query;

  // Validate expense id - mandatory
  const expenseId = params[0];
  if (isNaN(expenseId) || expenseId <= 0) return res.status(400).json({error: 'Invalid expense id'});


  // Validate expense body - mandatory
  const expense = req.body;
  const {isValid, msg} = validateExpense(expense);
  if (!isValid) {
    return res.status(400).json({error: msg});
  }

  const updated = await expenseRepo.updateExpense(req.auth.sub, expenseId, expense);

  // If no expense was updated, return 404
  if (updated.length === 0) return res.status(404).json({error: `No expense found with id=${expenseId} for this user`});

  // Convert parameters to camelCase
  const response = convertToCamelCase(updated[0]);

  return res.status(200).json(response);
}

async function deleteExpense(req, res) {
  const { params } = req.query;
  
  // Validate expense id - mandatory
  const expenseId = params[0];
  if (isNaN(expenseId) || expenseId <= 0) return res.status(400).json({error: 'Invalid expense id'});

  const response = await expenseRepo.deleteExpense(req.auth.sub, expenseId);

  // If no expense was deleted, return 404
  if (response === 0) return res.status(404).json({error: `No expense found with id=${expenseId} for this user`});

  return res.status(200).json(response);
}