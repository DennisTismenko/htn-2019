const heuristics = [
  require('./gyp'),
  require('./snyk'),
  require('./eslint'),
  require('./license'),
  require('./has-install-scripts'),
  require('./scm-missing'),
  require('./scm-tagged-versions'),
];

module.exports = async function computeHeuristics(context) {
  const results = await Promise.all(heuristics.map((fn) => fn(context)));
  return results.reduce((arr1, arr2) => arr1.concat(arr2), []);
}

// {
//   severity: "high"|"medium"|"low"|"none",
//   category: "quality",
//   reference: "{\"eslint/no-debugger\":\"src/index.js:13:34\"}",
//   message: "Uses debugger statement",
//   url: "https://eslint.org/docs/rules/no-debugger",
// }
