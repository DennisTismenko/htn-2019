const dataAnalyzer = require('../data-pipeline');
const dbService = require('./database-service');
const npmRegistry = require('../data-pipeline/utility/npmRegistry');
const npmRegistryVersions = require('../data-pipeline/utility/npmRegistryVersions');
const semver = require('semver');
const debug = require('debug')('main-heuristic');

module.exports = {
    async runHeuristics(pkgName, pkgVersion) {
        await runDependenciesHeuristics(pkgName, pkgVersion);
        await runDependenciesHeuristics(pkgName, prevPkgVersion);
    },
    async runDependenciesHeuristics(pkgName, pkgVersion) {
        let result = [];
        queue = [[pkgName, pkgVersion]]; // start BFS at source
        seenPackages = new Set();
        while (queue.length > 0) {
            let [name, version] = queue.shift();
            debug('runDependenciesHeuristics dequeue', name, version);
            let pkgInfo = await npmRegistry(name, version);
            for (let [dependencyName, range] of Object.entries(pkgInfo.dependencies || {})) {
                let versions = await npmRegistryVersions(dependencyName);
                let dependencyVersion = semver.maxSatisfying(versions, range);
                let dependency = [dependencyName, dependencyVersion];
                if (!seenPackages.has(dependency)) { // don't search duplicates
                    queue.push(dependency);
                    seenPackages.add(dependency);
                }
            }
            let pkg;
            for (pkg of seenPackages) {
                let [name, version] = pkg;
                pkg = await dbService.getPackageByNameVersion(name, version);
                if (!pkg) {
                    pkg = await dataAnalyzer(name, version);
                    await dbService.createPackage(name, version, pkg);
                    result.push(pkg);
                } else {
                    result.push(pkg.heuristics);
                }
            }
        }
        return result.reduce((arr1, arr2) => arr1.concat(arr2), []);
    },
        
}
