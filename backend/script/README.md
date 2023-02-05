# Databse initialization script folder

Independent script that initializes the database (creates tables, validates data and uploads it, etc)
Execute with e.g ts-node in the same folder as script with the current format:

ts-node script/index.ts "postgres_connection_string" "journeys_urls_delimited_by_comma" "stations_urls_delimited_by_comma"

e.g

ts-node script/index.ts postgres://postgres:password@localhost:5432/postgres "https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv" "https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv"
