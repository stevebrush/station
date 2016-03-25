#!/bin/bash

set -o errexit # Exit on error

#rm -rf node_modules/station-shared
#npm install station-shared
source .env
node index.js
#mongoexport -d station -c Location --jsonArray --out public/app/data/locations.json
#open http://localhost:5000/
