source ../.env.local
psql $PG_CONNECTION_STRING -P pager=off -f populate_sample_user.psql
psql $PG_CONNECTION_STRING -P pager=off -f populate_sample_category.psql
psql $PG_CONNECTION_STRING -P pager=off -f populate_sample_expense.psql