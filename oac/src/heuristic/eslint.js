const debug = require('debug')('main');
const path = require('path');
const {CLIEngine} = require("eslint");

const category = 'quality';

const eslint = new CLIEngine({
  envs: [
    'node',
  ],
  useEslintrc: false,
  plugins: [
    'security',
  ],
  rules: {
    'handle-callback-err': 'error',
    'no-alert': 'error',
    'no-buffer-constructor': 'error',
    'no-debugger': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-global-assign': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-mixed-requires': 'error',
    'no-new-func': 'error',
    'no-process-exit': 'error',
    'no-restricted-modules': ['error', {
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
    'no-with': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-new-buffer': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    'security/detect-unsafe-regex': 'error',
    'strict': 'error',
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
          severity: 'low',
          category,
          reference: JSON.stringify({
            [`eslint/${result.ruleId}`]: resultLocation,
          }),
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
