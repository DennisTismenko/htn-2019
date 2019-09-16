#!/usr/bin/env node

const main = require('../src/service/heuristic-service');

function usage() {
  const prog = process.argv[1];
  console.log(`usage: ${prog} <pkg> <version> [directory]`)
}

if (require.main === module) {
  const [pkg, version, directory] = process.argv.slice(2);
  if (pkg == null || version == null) {
    usage();
    process.exit(1);
  }

  main.runDependenciesHeuristics(pkg, version, directory)
    .then((result) => {
      console.log(result);
      process.exit(0);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}

