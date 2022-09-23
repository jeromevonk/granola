# Granola

![](docs/screencast_full.gif)

### What's this?

This is an app to *manually* control expenses. General idea is:

* Create categories
* Store expenses
* List monthly expenses
* Search for expenses
* Generate reports and charts about monthly/yearly expenses

### What it's not

This app **will not** automatically integrate with your bank and retrieve your expenses.

### How it was build

* Database in [PostgreSQL](https://www.postgresql.org/)
* Next.js for frontend and backend.
  * [Material UI](https://mui.com): starting point was [this example](https://github.com/mui/material-ui/tree/master/examples/nextj).
  * Charts powered by [Google Charts](https://developers.google.com/chart) and [this library](https://www.react-google-charts.com/).

### Where is it hosted?

It's not. You can run in locally or host it anywhere you like, though. If you want to do it for free, I suggest [Vercel](https://vercel.com/) and [ElephantSQL](https://www.elephantsql.com/).

### How can I run it locally?

If you have [Node.j](https://nodejs.org/en/)s and [docker](https://www.docker.com/) installed, you just need to:

* `git clone https://github.com/jeromevonk/granola.git`
* choose a path for docker to store the volume used by the PostgreSQL database and set it on the [docker-compose.yml](https://github.com/jeromevonk/granola/blob/main/database/docker-compose.yml#L10) file
* start the containers with `cd granola/database; docker-compose up`
* if you want to use sample user (*user = 'sample', password = '123456'*), categories and expenses
  * on *database* folder, create a *.env.local* file with `PG_CONNECTION_STRING=postgres://postgres:my_postgresql_password@localhost:5432/postgres`
  * run `./migrate_and_seed.sh`
* go to *backend-frontend* folder and create a *.env.local* file with variables `PG_CONNECTION_STRING=postgres://postgres:my_postgresql_password@localhost:5432/postgres and JWT_SECRET='your-own-secret'`
* run `npm install`
* run `npm run dev`

### Comments

Authentication: idea was derived from [Jason Watmore's](https://jasonwatmore.com) blog post: Next.js 11 - [User Registration and Login Tutorial with Example](https://jasonwatmore.com/post/2021/08/19/next-js-11-user-registration-and-login-tutorial-with-example-app)

### Details

#### Backend

##### Database

My goal was to create a lightweight solution so it could be hosted for free ([ElephantSQL](https://www.elephantsql.com/plans.html) for instance offers free plan with 20MB of data).

Therefore, I decided not to include some columns (such as time_created) to save space.

One interesting thing to keep in mind about space in PostgreSQL is the so-called
["Column tetris"](https://stackoverflow.com/a/7431468/660711) - the order or your columns might impact disk usage!

###### Category table

The main categories and sub-categories can be represented in the same table with the Adjavency list model, described in [this very nice article](https://www.mysqltutorial.org/mysql-adjacency-list-tree/).

Keep in mind that:

- deleting one parent category will **delete child categories** as well
- deleting a category will **delete all expenses** related to this category

##### API routes

For easier understanding, import [this file](https://github.com/jeromevonk/granola/blob/main/docs/Granola%20API.postman_collection.json) into [Postman](https://www.postman.com/downloads/).

* POST /api/users/authenticate
* POST /api/users/register
* DELETE /api/users
* GET /api/categories
* POST /api/categories
* PATCH /api/categories/:id
* DELETE /api/categories/:id
* GET /api/expenses
* GET /api/expenses/:year/:month
* GET /api/expenses/years
* POST /api/expenses
* POST /api/expenses/recurring
* PUT /api/expenses/:id
* DELETE /api/expenses
* DELETE /api/expenses/:id
* GET /api/stats/year-evolution
* GET /api/stats/month-evolution
* GET /api/stats/category-report
