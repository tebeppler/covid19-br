#!/usr/bin/bash

npm run build;
pkill node;
npm start -- --port 80 &
reset
