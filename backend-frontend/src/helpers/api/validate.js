export { validateExpense, validateEvolution, validateCategoryReport, validateCopyRecurring };

// -------------------------------
// Validate a new Expense
// -------------------------------
function validateExpense(expense) {
  let res = {};

  // Dates
  res = validateDates(expense);
  if (!res.isValid) return res;

  // Description and details
  res = validateTextFields(expense);
  if (!res.isValid) return res;

  // Amounts, category and recurring
  res = validateNumbersAndBoolean(expense);
  if (!res.isValid) return res;

  return { isValid: true }
}

function validateDates(expense) {
  const {
    year,
    month,
    day
  } = expense;

  if (!year || year < 2012 || year > 2050) return { isValid: false, msg: "Invalid 'year'. Must be between 2012 and 2050" };
  if (!month || month < 1 || month > 12) return { isValid: false, msg: "Invalid 'month'. Must be between 1 and 12" };
  if (day !== null) {
    if (isNaN(day) || !Number.isInteger(day) || day < 1 || day > 31) return { isValid: false, msg: "Invalid 'day'. Accepted: null and (1,31)" };
  }

  return { isValid: true }
}

function validateTextFields(expense) {
  const {
    description,
    details,
  } = expense;

  if (!description || description.length < 3 || description.length > 70) return { isValid: false, msg: "Invalid 'desciption'. Len must be >2 and <= 70" };
  if (details !== null) {
    if (details === undefined || details.length > 70) return { isValid: false, msg: "Invalid 'details'. Accepted: null and string with len <= 70" };
  }

  return { isValid: true }
}

function validateNumbersAndBoolean(expense) {
  const {
    amountPaid,
    amountReimbursed,
    category,
    recurring
  } = expense;

  if (isNaN(amountPaid) || amountPaid === false || amountPaid === true || amountPaid < 0 || amountPaid > 99999) return { isValid: false, msg: "Invalid 'amountPaid'. Must be a number, 0 <= x < 100000" };
  if (isNaN(amountReimbursed) || amountReimbursed === false || amountReimbursed === true || amountReimbursed < 0 || amountReimbursed > amountPaid) return { isValid: false, msg: "Invalid 'amountReimbursed'. Must be a number, >= 0 and < amountPaid" };
  if (!category || isNaN(category) || category < 1) return { isValid: false, msg: "Invalid 'category'. Must be a number > 0" };
  if (recurring !== true && recurring !== false) return { isValid: false, msg: "Invalid 'recurring'. Must be boolean" };

  return { isValid: true }
}

// -------------------------------
// Validate an evolution request
// -------------------------------
function validateEvolution(params) {
  let res = {};

  // Categories
  res = validateCategories(params);
  if (!res.isValid) return res;

  // Years
  res = validateYears(params);
  if (!res.isValid) return res;

  return { isValid: true }
}

// -------------------------------
// Validate a report request
// -------------------------------
function validateCategoryReport(params) {
  let res = {};

  // Years
  res = validateYears(params);
  if (!res.isValid) return res;

  // Type
  res = valideReportTypes(params);
  if (!res.isValid) return res;

  return { isValid: true }
}

function validateCategories(params) {
  let { mainCategory, subCategory } = params;

  if (mainCategory) {
    mainCategory = Number(mainCategory);
    if (!Number.isInteger(mainCategory) || mainCategory < 1) return { isValid: false, msg: "Invalid 'mainCategory'. Must be a number > 0" };
  }

  if (subCategory) {
    subCategory = Number(subCategory);
    if (!Number.isInteger(subCategory) || subCategory < 2) return { isValid: false, msg: "Invalid 'subCategory'. Must be a number > 1" };
  }

  if (mainCategory && subCategory) return { isValid: false, msg: "'mainCategory' and 'category' are mutually exclusive" };
  return { isValid: true }
}

function validateYears(params) {
  let { startYear, endYear } = params;

  if (startYear) {
    startYear = Number(startYear);
    if (!Number.isInteger(startYear) || startYear < 2012) return { isValid: false, msg: "Invalid 'startYear'" };
  }

  if (endYear) {
    endYear = Number(endYear);
    if (!Number.isInteger(endYear) || endYear > 2050 || endYear < startYear) return { isValid: false, msg: "Invalid 'endYear'. Must be integer and >= 'startYear'" };
  }

  return { isValid: true }
}

function valideReportTypes(params) {
  let { reportType } = params;

  const allowed = [
    'mainCategory',
    'subCategory',
  ]

  if (!allowed.includes(reportType) && isNaN(reportType)) return { isValid: false, msg: `Invalid 'reportType'. Accepted: ${allowed} and a categoryID` };

  return { isValid: true }
}

// ----------------------------------
// Validate a copy recurring request
// ----------------------------------
function validateCopyRecurring(params) {
  const { year, month, keepAmounts } = params;

  if (!year || year < 2012 || year > 2050) return { isValid: false, msg: "Invalid 'year'. Must be between 2012 and 2050" };
  if (!month || month < 1 || month > 12) return { isValid: false, msg: "Invalid 'month'. Must be between 1 and 12" };
  if (keepAmounts !== true && keepAmounts !== false) return { isValid: false, msg: "Invalid 'keepAmounts'. Must be true or false" };

  return { isValid: true }
}

