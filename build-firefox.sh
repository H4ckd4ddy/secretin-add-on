#!/bin/bash

mkdir -p libs
wget -O libs/secretin.js https://raw.githubusercontent.com/secretin/secretin-lib/develop/dist/secretin.js
wget -O libs/adapters/browser.js https://raw.githubusercontent.com/secretin/secretin-lib/develop/dist/adapters/browser.js

zip -r Secret-in.xpi manifest.json background.js agent.js icons libs popup options