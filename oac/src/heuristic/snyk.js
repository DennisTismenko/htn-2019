const snyk = require('snyk');

module.exports = async function snykHeuristics(context) {
    let pkgName = context.pkg.name;
    snyk.api = process.env.SNYK_TOKEN;
    const result = await snyk.test(pkgName);
    console.log(result);
}