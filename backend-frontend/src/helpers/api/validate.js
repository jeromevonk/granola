export { validateExpense };

function validateExpense(expense) {
  const {
    year, 
    month, 
    day, 
    description, 
    details, 
    amountPaid, 
    amountReimbursed, 
    category,
    recurring
  } = expense;
  
  if (!year || year < 2012 || year > 2050) return { isValid: false, msg: "Invalid 'year'. Must be between 2012 and 2050"};
  if (!month || month < 1 || month > 12) return { isValid: false, msg: "Invalid 'month'. Must be between 1 and 12"};
  if (day !== null) {
    if (isNaN(day) || !Number.isInteger(day) || day < 1 || day > 31) return { isValid: false, msg: "Invalid 'day'. Accepted: null and (1,31)" };
  }
  if (!description || description.length < 3 || description.length > 70) return { isValid: false, msg: "Invalid 'desciption'. Len must be >2 and <= 70" };
  if (details !== null) {
    if (details === undefined || details.length > 70) return { isValid: false, msg: "Invalid 'details'. Accepted: null and string with len <= 70" };
  }
  if (isNaN(amountPaid) || amountPaid === false || amountPaid === true || amountPaid < 0) return { isValid: false, msg: "Invalid 'amountPaid'. Must be a number, >= 0" };
  if (isNaN(amountReimbursed) || amountReimbursed === false || amountReimbursed === true || amountReimbursed < 0) return { isValid: false, msg: "Invalid 'amountReimbursed'. Must be a number, >= 0" };
  if (!category || isNaN(category) || category < 1) return { isValid: false, msg: "Invalid 'category'. Must be a number > 0" };
  if (recurring !== true && recurring !== false) return { isValid: false, msg: "Invalid 'recurring'. Must be boolean" };

  return { isValid: true}

}