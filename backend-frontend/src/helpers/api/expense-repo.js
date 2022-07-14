import { postgresqlRepo } from 'src/helpers/api';

export const expenseRepo = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};

async function getExpenses(user, expenseId = null, search = null, year = null, month = null) {
  return postgresqlRepo.getExpenses(user, expenseId, search, year, month);
}

async function createExpense(user, expense) {
  return postgresqlRepo.createExpense(user, expense);
}

async function updateExpense(user, expenseId, expense) {
  return postgresqlRepo.updateExpense(user, expenseId, expense);
}

async function deleteExpense(user, expenseId) {
  return postgresqlRepo.deleteExpense(user, expenseId);
}