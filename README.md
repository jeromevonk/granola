# granola (WORK IN PROGRESS)

### What's this?

This is an app I build to control my expenses. General idea is:

* Store my expenses
* List montlhy expenses
* Generate graphics about monthly/yearly expenses

### How it was build

* Database in PostgreSQL
* Next.js for frontend and backend.
  * [Material UI](https://mui.com/https:/): starting point was [this example](https://github.com/mui/material-ui/tree/master/examples/nextjshttps:/)
  * Authentication and some ideas from [this example](https://jasonwatmore.com/post/2021/08/19/next-js-11-user-registration-and-login-tutorial-with-example-app) by [Jason Watmore](https://jasonwatmore.com).

### Comments

Authentication: 

Users:

### Details

#### Backend

##### Database

My goal was to create a lightweight solution so I could host it for free on [ElephantSQL](https://www.elephantsql.com/plans.html) (free plan offers 20MB of data).

Therefore, I decided not to include some columns (such as XXX).

One interesting thing to keep in mind about space in PostgreSQL is the so-called
["Column tetris"](https://stackoverflow.com/a/7431468/660711) - the order or your columns might impact disk usage!

About the category table: https://www.mysqltutorial.org/mysql-adjacency-list-tree/

##### API routes

* POST /api/users/authenticate ✓
* POST /api/users/register ✓
* GET /api/categories ✓
* POST /api/categories ✓
* DELETE /api/categories
* GET /api/expenses ✓
* GET /api/expenses/YYYY/MM ✓
* POST /api/expense ✓
* PATCH /api/expense ✓
* DELETE /api/expense/{id} ✓
* GET /api/stats/year-evolution ✓
* GET /api/stats/month-evolution ✓
