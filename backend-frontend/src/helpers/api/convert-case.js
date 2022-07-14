export { convertToCamelCase };

function convertToCamelCase(expense) {
  // Change amount_paid and amount_reimbursed to amountPaid and amountReimbursed
  // The others ans single words and therefore equal in both conventions
  expense.amountPaid = expense.amount_paid;
  expense.amountReimbursed = expense.amount_reimbursed;
  delete expense.amount_paid;
  delete expense.amount_reimbursed;

  return expense;

}