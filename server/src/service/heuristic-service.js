const dataAnalyzer = require('../data-pipeline');
const dbService = require('./database-service');

module.exports = {
    runHeuristics: async function runHeuristics(pkgName, version) {
        let heuristicData = await dataAnalyzer(pkgName, version);
        dbService.createPackage(pkgName, version, heuristicData);
    },
}