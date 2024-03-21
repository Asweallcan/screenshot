#!/bin/bash

NODE_ENV=development webpack --config renderers/webpack.config.js --watch &
tsc -p app/tsconfig.json -w
wait
