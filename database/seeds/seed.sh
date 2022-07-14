source ../local.env
psql $PG_CONNECTION_STRING -P pager=off -f populate_category.psql
psql $PG_CONNECTION_STRING -P pager=off -f populate_user.psql
psql $PG_CONNECTION_STRING -P pager=off -f populate_expense.psql
psql $PG_CONNECTION_STRING -P pager=off -f populate_expense_real_data.psql