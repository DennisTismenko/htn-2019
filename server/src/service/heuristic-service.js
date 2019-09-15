'use strict';

const dataAnalyzer = require('../data-pipeline');
const dbService = require('./database-service');
const npmRegistry = require('../data-pipeline/utility/npmRegistry');
const npmRegistryVersions = require('../data-pipeline/utility/npmRegistryVersions');
const semver = require('semver');
const debug = require('debug')('main');

class HeuristicService {
    async runHeuristics(pkgName, pkgVersion) {
        return await this.runDependenciesHeuristics(pkgName, pkgVersion);
    }
    async runDependenciesHeuristics(pkgName, pkgVersion) {
        let result = [];
        let queue = [[pkgName, pkgVersion]]; // start BFS at source
        let seenPackages = new Set();
        while (queue.length > 0) {
            let [name, version] = queue.shift();
            debug('heuristics bfs dequeue:', `${name}@${version}`);
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
        return result
            .reduce((arr1, arr2) => arr1.concat(arr2), [])
            .sort((x, y) => x.reference.localeCompare(y.reference));
    }
}


module.exports = new HeuristicService();