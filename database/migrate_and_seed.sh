cd migrations;
echo "Dropping"
./drop.sh;
echo "Migrating"
./migrate.sh;
cd ../seeds;
echo "Seeding"
./seed.sh