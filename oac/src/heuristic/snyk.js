const snyk = require('snyk');
const category = 'security';

module.exports = async function snykHeuristics(context) {
    let pkgName = context.pkg.name;
    snyk.api = process.env.SNYK_TOKEN;
    const result = await snyk.test(pkgName);
    return result.vulnerabilities.map((vuln) => ({
        severity: vuln.severity,
        category,
        reference: JSON.stringify({ snyk: vuln.id }),
        message: vuln.description,
    }));
}