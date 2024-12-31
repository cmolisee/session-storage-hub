#!/bin/bash

npm run build &&
zip -r chrome.zip ./dist/chrome-mv3 &&
npm run build:edge &&
zip -r edge.zip ./dist/edge-mv3 &&
npm run build:firefox &&
zip -r firefox.zip ./dist/firefox-mv2 &&
npm run build:safari &&
zip -r safari.zip ./dist/safari-mv2