#!/usr/bin/env node

const main = require('./src');

function usage() {
  const prog = process.argv[1];
  console.log(`usage: ${prog} <pkg> <version>`)
}

if (require.main === module) {
  const [pkg, version] = process.argv.slice(2);
  if (pkg == null || version == null) {
    usage();
    process.exit(1);
  }
  main(pkg, version)
    .then((result) => {
      console.log('SUCCESS', result);
    })
    .catch((err) => {
      console.log('ERROR', err);
    });
}
