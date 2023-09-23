#!/bin/bash

mkdir -p libs
wget -O libs/secretin.js https://raw.githubusercontent.com/secretin/secretin-lib/develop/dist/secretin.js
wget -O libs/adapters/browser.js https://raw.githubusercontent.com/secretin/secretin-lib/develop/dist/adapters/browser.js

xcrun /Applications/Xcode.app/Contents/Developer/usr/bin/safari-web-extension-converter .
touch ./Secret-in/Secret-in
