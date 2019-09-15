const dataAnalyzer = require('../data-pipeline');
const dbService = require('./database-service');

module.exports = {
    async runHeuristics(pkgName, version) {
        let pkg = await dbService.getPackageByNameVersion(pkgName, version);
        if (!pkg) {
            let heuristicData = await dataAnalyzer(pkgName, version);
            await dbService.createPackage(pkgName, version, heuristicData);
        }
        
    },
}