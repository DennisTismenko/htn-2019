#!/bin/bash -e

yarn clean
"$(yarn bin)/parcel" build src/client/index.html -d dist/client
"$(yarn bin)/parcel" build src/server/index.tsx -d dist/server --target=node6
mv dist/client/index.html dist/server/index.html
