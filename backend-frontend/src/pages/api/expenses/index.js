import { apiHandler, expenseRepo, validateExpense, convertToCamelCase } from 'src/helpers/api';

export default apiHandler({
  get: getAllExpenses,
  post: postExpense,
});

async function getAllExpenses(req, res) {
  
  // Is there a 'search' key in the querystring?
  const { id, search } = req.query;

  try {
    // Get expenses
    const response = await expenseRepo.getExpenses(req.auth.sub, id, search)
    return res.status(200).json(response);
  } catch(err) {
    return res.status(400).json({error: err.message});
  }
}

async function postExpense(req, res) {

  // Validate expense body - mandatory
  const expense = req.body;
  const {isValid, msg} = validateExpense(expense);
  if (!isValid) {
    return res.status(400).json({error: msg});
  }

  try {
    const created = await expenseRepo.createExpense(req.auth.sub, expense);

    // If no expense was created, return 400
    if (created.length === 0) return res.status(400).json({error: `Could not create expense`});

    // Convert parameters to camelCase
    const response = convertToCamelCase(created[0]);

    return res.status(201).json(response);
  } catch(err) {
    return res.status(400).json({error: err.message});
  }
}