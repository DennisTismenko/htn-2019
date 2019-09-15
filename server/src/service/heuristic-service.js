const dataAnalyzer = require('../data-pipeline');
const dbService = require('./database-service');

module.exports = {
    async runHeuristics(pkgName, version) {
        let pkg = await dbService.getPackageByNameVersion(pkgName, version);
        if (!pkg) {
            pkg = await dataAnalyzer(pkgName, version);
            await dbService.createPackage(pkgName, version, pkg);
            return pkg
        } else {
          return pkg.heuristics
        }
    },
}
