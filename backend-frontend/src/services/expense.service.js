import getConfig from 'next/config';
import { fetchWrapper } from 'src/helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/expenses`;

export const expenseService = {
  createNewExpense,
  editExpense,
  deleteExpense,
};

function createNewExpense(expense) {
  return fetchWrapper.post(baseUrl, expense);
}

function editExpense(expense) {
  return fetchWrapper.put(baseUrl, expense); //  TODO
}


function deleteExpense(expense) {
  return fetchWrapper.delete(baseUrl, expense); // TODO
}

