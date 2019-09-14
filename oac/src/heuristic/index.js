const heuristics = [
  // require('./eslint'),
  // require('./compliance')
  require('./snyk-security')
];

module.exports = async function computeHeuristics(context) {
  const results = await Promise.all(heuristics.map((fn) => fn(context)));
  return results.reduce((arr1, arr2) => arr1.concat(arr2), []);
}

// {
//   severity: "high"|"medium"|"low",
//   category: "quality",
//   message: "Uses debugger statement",
//   url: "https://eslint.org/docs/rules/no-debugger",
// }
