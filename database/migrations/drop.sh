source ../local.env
psql $PG_CONNECTION_STRING -f drop_all.psql >/dev/null