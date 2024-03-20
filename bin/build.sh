#!/bin/bash

rm -rf dist

NODE_ENV=production webpack --config renderers/webpack.config.js &
tsc -p app/tsconfig.json &
wait
