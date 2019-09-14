const {CLIEngine} = require("eslint");

const jsRules = {
  'no-alert': 'error',
  'no-debugger': 'error',
  'no-eval': 'error',
  'no-extend-native': 'error',
  'no-global-assign': 'error',
  'no-implicit-globals': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-with': 'error',
  'strict': 'error',
};

const nodeRules = {
  'handle-callback-err': 'error',
  'no-buffer-constructor': 'error',
  'no-mixed-requires': 'error',
  'no-process-exit': 'error',
  'no-sync': 'error',
};

const eslint = new CLIEngine({
  envs: ["node"],
  useEslintrc: false,
  rules: {
    ...jsRules,
    ...nodeRules,
  },
});

module.exports = async function eslintHeuristic(context) {
  const report = eslint.executeOnFiles([context.pkgDir]);
  // console.log(report);
  return [];
}
