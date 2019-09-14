const snyk = require('snyk');

module.exports = async function snykHeuristics(context) {
    let pkgName = context.pkg.name;
    // snyk.api = 'c488385d-ea62-4bad-96be-04dc4977772b';
    snyk.api = process.env.SNYK_TOKEN;
    const result = await snyk.test(pkgName);
    console.log(result);
}