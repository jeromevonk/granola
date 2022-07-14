export const postgresqlRepo = {
  getCategories,
  createCategory,
  findUser,
  createUser,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getEvolutionPerYear,
  getEvolutionPerMonth,
};

const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
});

const CURRENT_YEAR = new Date().getFullYear();


// ------------------------------------------
// Categories
// ------------------------------------------
async function getCategories() {
  return knex
    .select('c1.id', 'c1.parent_id', 'c1.title', 'c2.title as parent_title')
    .from({c1: 'category'})
    .leftJoin({c2: 'category'}, 'c1.parent_id', '=', 'c2.id');
}

async function createCategory(parentId, title) {
  return knex('category').insert({parent_id: parentId, title: title});
}

// ------------------------------------------
// User
// ------------------------------------------
async function findUser(username) {
  return knex
    .select('*')
    .from({u: 'users'})
    .where({username: username});
}

async function createUser(user) {
  return knex('users')
    .insert({username: user.username, hash: user.hash});
}

// ------------------------------------------
// Expenses
// ------------------------------------------
async function getExpenses(user, expenseId = null, search = null, year = null, month = null) {
  return knex
    .select('*')
    .from('expense')
    .where({user_id: user})
    .modify( (queryBuilder) => {
      if (expenseId) {
        // If id is provided, ignore other parameters
        queryBuilder.andWhere({id: expenseId});
      }
      else if (year && month) {
        queryBuilder.andWhere({year: year, month: month});
      } else if (year && !month) {
        queryBuilder.andWhere({year: year});
      } else if (!year && month) {
        queryBuilder.andWhere({month: month});
      } else {
        // Search does not work when year/month are passed
        if (search) {
          queryBuilder
            .andWhereILike('description', `%${search}%`)
            .orWhereILike('details', `%${search}%`);
        }
      }
    });
}

async function createExpense(user, expense) {
  return knex('expense')
    .insert({ 
      user_id: user,
      year: expense.year,
      month: expense.month,
      day: expense.day,
      description: expense.description,
      details: expense.details,
      amount_paid: expense.amountPaid,
      amount_reimbursed: expense.amountReimbursed,
      category: expense.category,
      recurring: expense.recurring,
    }, [
      'id',
      'year',
      'month',
      'day',
      'description',
      'details',
      'amount_paid',
      'amount_reimbursed',
      'category',
      'recurring'
    ])
}

async function updateExpense(user, expenseId, expense) {
  return knex('expense')
    .where({user_id: user, id: expenseId})
    .update({
      year: expense.year,
      month: expense.month,
      day: expense.day,
      description: expense.description,
      details: expense.details,
      amount_paid: expense.amountPaid,
      amount_reimbursed: expense.amountReimbursed,
      category: expense.category,
      recurring: expense.recurring,
    }, [
      'id',
      'year',
      'month',
      'day',
      'description',
      'details',
      'amount_paid',
      'amount_reimbursed',
      'category',
      'recurring'
    ])
}

async function deleteExpense(user, expenseId) {
  return knex('expense')
    .where({user_id: user, id: expenseId})
    .del()
}

async function getEvolutionPerYear(user, parentCategory = null, category = null, startYear = 2012, endYear = CURRENT_YEAR) {
  return knex
    .select('year')
    .sum({ amount_spent: 'amount_spent' })
    .from({exp: 'expense_view'})
    .modify( (queryBuilder) => {
      if (parentCategory) queryBuilder.join('category as cat', 'exp.category', '=', 'cat.id');
    })
    .where({user_id: user})
    .whereBetween('year', [startYear, endYear])
    .modify( (queryBuilder) => {
      if (category) queryBuilder.where({category: category});
      if (parentCategory) queryBuilder.where({parent_id: parentCategory});
    })
    .groupBy('year')
    .orderBy(['year'])
}


async function getEvolutionPerMonth(user, parentCategory = null, category = null, startYear = 2012, endYear = CURRENT_YEAR) {
  return knex
    .select('year', 'month')
    .sum({ amount_spent: 'amount_spent' })
    .from({exp: 'expense_view'})
    .modify( (queryBuilder) => {
      if (parentCategory) queryBuilder.join('category as cat', 'exp.category', '=', 'cat.id');
    })
    .where({user_id: user})
    .whereBetween('year', [startYear, endYear])
    .modify( (queryBuilder) => {
      if (category) queryBuilder.where({category: category});
      if (parentCategory) queryBuilder.where({parent_id: parentCategory});
    })
    .groupBy('year')
    .groupBy('month')
    .orderBy(['year', 'month'])
}