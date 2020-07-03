#!/bin/bash

# scrape for todos
touch TEMP_TODO
grep -v "TODO" TODO >> TEMP_TODO
rm TODO
mv TEMP_TODO TODO
grep -r "TODO" js >> TODO
grep -r "TODO" server >> TODO

# do babel transform into temp_bin
mkdir temp_bin
npm run babel -- js/ -d temp_bin/

# make the bundle for each page and put it in the page's bin directory
mkdir home/bin
npm run browserify -- temp_bin/pages/home.js -o home/bin/bundle.js
mkdir home/users/bin
npm run browserify -- temp_bin/pages/users.js -o home/users/bin/bundle.js

rm -rf temp_bin


