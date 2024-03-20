#!/bin/bash

nodemon --exec "NODE_ENV=development webpack --config renderers/webpack.config.js" --ext .ts,.tsx,.json,.less --watch renderers &
nodemon --exec "tsc -p app/tsconfig.json" --ext .ts,.json --watch app &
nodemon --exec "electron dist/app/main/index.js" --watch dist --ext .js,.json,.html &
wait
