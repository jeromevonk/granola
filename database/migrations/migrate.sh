source ../.env.local
psql $PG_CONNECTION_STRING -f create_user_table.psql >/dev/null
psql $PG_CONNECTION_STRING -f create_category_table.psql >/dev/null
psql $PG_CONNECTION_STRING -f create_expense_table.psql >/dev/null
psql $PG_CONNECTION_STRING -f create_expense_view.psql >/dev/null