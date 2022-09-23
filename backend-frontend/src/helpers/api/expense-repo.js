import { postgresqlRepo } from 'src/helpers/api';

export const expenseRepo = {
  getExpenses,
  getYears,
  searchExpenses,
  createExpense,
  copyRecurringToNextMonth,
  updateExpense,
  deleteExpense,
  deleteExpenses,
};

async function getExpenses(user, expenseId = null, year = null, month = null) {
  return postgresqlRepo.getExpenses(user, expenseId, year, month);
}

async function getYears(user) {
  const ret = await postgresqlRepo.getYears(user);

  return ret.map(item => item.year);
}

async function searchExpenses(user, search = null) {
  return postgresqlRepo.searchExpenses(user, search);
}

async function createExpense(user, expense) {
  return postgresqlRepo.createExpense(user, expense);
}

async function copyRecurringToNextMonth(user, year, month, keepAmounts) {
  return postgresqlRepo.copyRecurringToNextMonth(user, year, month, keepAmounts);
}

async function updateExpense(user, expenseId, expense) {
  return postgresqlRepo.updateExpense(user, expenseId, expense);
}

async function deleteExpense(user, expenseId) {
  return postgresqlRepo.deleteExpense(user, expenseId);
}

async function deleteExpenses(user, expenseList) {
  return postgresqlRepo.deleteExpenses(user, expenseList);
}