# helsinki-city-bike-app
https://github.com/solita/dev-academy-2023-exercise

This project is deployed at https://helsinki-city-bike-app-frontend.onrender.com/

On the bottom there is a small guide on how to run the project locally if needed.

# Description
helsinki-city-bike-app is a web application that lists bike journeys and stations in the helsinki area from 2021-05 to 2021-07. There are a total of over 3 million journeys and about 400 stations that have been parsed, validated and uploaded in the database. The frontend presents a simple user interface to browse, search, sort, and upload new journeys and stations. In the stations menu, you can click on stations to see their location on the map and some other details.

# Technology choices
Both backend and frontend use TypeScript nearly exclusively. I chose TypeScript as it is a great improvement over JavaScript with its strict type safety, and it was something I was already familiar with quite well. TypeScript also convenitely runs very well on both the backend & frontend. For the backend frameworks I chose Node with Express as those are pretty much the standards. As for the frontend the framework of choice is plain React as it was something I was familiar with. Initially I was going with Next.js, but I thought it was bit of an overkill for the simple UI I was going for. Database is PostgreSQL.

# Database installation and other prerequisites

## Database
Install PostgreSQL database

After installing the database, run npm install on the backend root folder and add the following entries to a .env file also at the root:

DB_HOST=localhost

DB_PORT=5432

DB_USER=postgres

DB_PASS=password

(Either use the above DB_HOST, DB_PORT, etc or the bottom DB_CONNECTION_STRING)

DB_CONNECTION_STRING=replace_with_actual_connection_string?ssl=true

APP_PORT=4000

APP_CORS_DOMAIN=http://localhost:3000

APP_DATA_JOURNEYS_URLS="https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv"

APP_DATA_STATIONS_URLS=https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv

Finally run the upload-script.ts in src/data with something such as ts-node (npm install ts-node and then ts-node upload-script.ts)
All the data should now be parsed, validated and uploaded to the database.

## Frontend
Add a .env file on the frontend root folder with following entries:

REACT_APP_API_URL=http://localhost:4000

REACT_APP_API_MAP_KEY=google_maps_api_key (required for station map to work, available for free for a few minutes of work - see e.g https://developers.google.com/maps/documentation/javascript/get-api-key).

# Running the project
After database is initialized and other prerequisites are OK, it should be enough to just run npm install and npm run start in both backend & frontend root folders.

# TODO
There are no tests. The app was taking a bit more time that I hoped for so I decided to not do tests.

There is no filtering - however pagination, sort, and search should work fine.

There were some minor bugs but nothing that should break the app completely.
