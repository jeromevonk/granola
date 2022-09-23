import { apiHandler, expenseRepo, validateExpense } from 'src/helpers/api';

export default apiHandler({
  get: getAllExpenses,
  post: postExpense,
  delete: deleteExpenses,
});

async function getAllExpenses(req, res) {

  // Is there a 'search' key in the querystring?
  const { id, search } = req.query;
  let response;
  try {
    // Get expenses
    if (id) {
      response = await expenseRepo.getExpenses(req.auth.sub, id);
    } else if (search) {
      response = await expenseRepo.searchExpenses(req.auth.sub, search);
    } else {
      response = await expenseRepo.getExpenses(req.auth.sub);
    }

    return res.status(200).json(response);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function postExpense(req, res) {

  // Validate expense body - mandatory
  const expense = req.body;
  const { isValid, msg } = validateExpense(expense);
  if (!isValid) {
    return res.status(400).json({ message: msg });
  }

  try {
    const created = await expenseRepo.createExpense(req.auth.sub, expense);

    // If no expense was created, return 400
    if (created.length === 0) return res.status(400).json({ message: `Could not create expense` });

    // Convert parameters to camelCase
    const response = created[0];

    return res.status(201).json(response);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function deleteExpenses(req, res) {

  // Validate expense body - mandatory
  const expenseList = req.body;
  if (!Array.isArray(expenseList) || expenseList.length < 1 || expenseList.length > 50) return res.status(400).json({ message: 'Invalid list of IDs. Must be 1 < X < 50' });

  try {
    const ret = await expenseRepo.deleteExpenses(req.auth.sub, expenseList);

    // To be returned
    const response = {
      deleted: [],
      failed: expenseList
    };

    // Put all deleted items on the array
    for (const item of ret) {
      if (expenseList.includes(item.id)) {
        response.deleted.push(item.id);
      }
    }

    // The ones not deleted remain on failed array
    response.failed = expenseList.filter(id => !response.deleted.includes(id));

    return res.status(200).json(response);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}