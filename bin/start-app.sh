#!/bin/bash

nodemon --exec "electron dist/app/main/index.js" --ext .js,.json --watch dist
