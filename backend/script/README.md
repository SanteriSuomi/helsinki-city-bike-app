# Databse initialization script folder

Independent script that initializes the database (creates tables, validates data and uploads it, etc)
Execute with e.g ts-node in the same folder as script: ts-node script/index.ts
Also requires a .env file in the same directory with the following entries:
DB_CONNECTION_STRING=Postgres connection string with possible "?ssl=true" at the end to enable SSL
APP_DATA_JOURNEYS_URLS=Journey data urls (URL to the CSV file(s), delimited by comma)
APP_DATA_STATIONS_URLS=Station data urls (URL to the CSV file(s), delimited by comma)
