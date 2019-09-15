const debug = require('debug')('main');
const path = require('path');
const {CLIEngine} = require("eslint");

const eslint = new CLIEngine({
  useEslintrc: false,
  envs: [
    'node',
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  plugins: [
    'node',
    'security',
  ],
  rules: {
    'handle-callback-err': 'warn',
    'no-alert': 'warn',
    'no-buffer-constructor': 'warn',
    'no-debugger': 'error',
    'no-eval': 'error',
    'no-extend-native': 'warn',
    'no-global-assign': 'warn',
    'no-implicit-globals': 'warn',
    'no-implied-eval': 'error',
    'no-mixed-requires': 'warn',
    'no-new-func': 'warn',
    'no-process-exit': 'error',
    'no-restricted-modules': ['warn', {
      paths: [{
        'name': 'dns',
        'message': 'net',
      },{
        'name': 'http',
        'message': 'net',
      }, {
        'name': 'https',
        'message': 'net',
      }, {
        'name': 'http2',
        'message': 'net',
      }, {
        'name': 'tls',
        'message': 'net',
      }, {
        'name': 'net',
        'message': 'net',
      }, {
        'name': 'fs',
        'message': 'fs',
      }, {
        'name': 'os',
        'message': 'os',
      }, {
        'name': 'child_process',
        'message': 'os',
      }],
    }],
    'node/no-deprecated-api': 'warn',
    'security/detect-buffer-noassert': 'warn',
    'security/detect-child-process': 'warn',
    'security/detect-disable-mustache-escape': 'warn',
    'security/detect-eval-with-expression': 'error',
    'security/detect-new-buffer': 'warn',
    'security/detect-no-csrf-before-method-override': 'warn',
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-non-literal-require': 'warn',
    'security/detect-possible-timing-attacks': 'warn',
    'security/detect-pseudoRandomBytes': 'warn',
    'security/detect-unsafe-regex': 'warn',
    'strict': 'warn',
  },
});

module.exports = async function eslintHeuristic(context) {
  try {
    const report = eslint.executeOnFiles([context.pkgDir]);
    if (report.usedDeprecatedRules.length > 0) {
      debug('eslint is using deprecated rules', JSON.stringify(report.usedDeprecatedRules));
    }
    return report.results
      .filter((fileResult) => fileResult.errorCount > 0)
      .map(({
        messages,
        ...fileResult
      }) => messages.map(result => {
        const resultLocation = `${path.relative(context.pkgDir, fileResult.filePath)}:${result.line}:${result.column}`;
        return {
          severity: ['none', 'low', 'medium'][result.severity],
          category: 'risk',
          reference: JSON.stringify([context.pkg.name, context.pkg.version, `eslint/${result.ruleId}`, resultLocation]),
          message: `${result.message} (${result.ruleId})
${context.pkg.name}@${context.pkg.version}:${resultLocation}`,
          url: `https://google.com/search?q=${encodeURIComponent(`eslint rule ${result.ruleId}`)}`
        };
      }))
      .reduce((arr1, arr2) => arr1.concat(arr2), [])
  } catch (err) {
    if (err.messageTemplate === 'file-not-found') {
      return [];
    }
    throw err;
  }
}
