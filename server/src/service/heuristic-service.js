'use strict';

const dataAnalyzer = require('../data-pipeline');
const dbService = require('./database-service');
const npmRegistry = require('../data-pipeline/utility/npmRegistry');
const npmRegistryVersions = require('../data-pipeline/utility/npmRegistryVersions');
const semver = require('semver');
const debug = require('debug')('main');

class HeuristicService {
    async runHeuristics(pkgName, pkgVersion) {
        const heuristics = await this.dataAnalyzerOnDependencies(pkgName, pkgVersion);
        return heuristics
    }

    async dataAnalyzerOnDependencies(pkgName, pkgVersion) {
        const result = [];
        const queue = [[pkgName, pkgVersion]];
        // start BFS at source
        const seenPackages = new Set();
        while (queue.length > 0) {
            const [currPkgName, currPkgVersion] = queue.shift();
            debug('heuristics bfs dequeue:', `${currPkgName}@${currPkgVersion}`);
            result.push(await this.dataAnalyzer(currPkgName, currPkgVersion));
            const currPkg = await npmRegistry(currPkgName, currPkgVersion);
            const currPkgDependencies = Object.entries(currPkg.dependencies || {});
            for (const [depPkgName, depPkgVersionRange] of currPkgDependencies) {
                const depPkgVersions = await npmRegistryVersions(depPkgName);
                const depPkgVersion = semver.maxSatisfying(depPkgVersions, depPkgVersionRange);
                const dependency = [depPkgName, depPkgVersion];
                // don't search packages you've seen
                if (!seenPackages.has(dependency)) {
                    queue.push(dependency);
                    seenPackages.add(dependency);
                }
            }
        }
        return result
            .reduce((arr1, arr2) => arr1.concat(arr2), [])
            .sort((x, y) => x.reference.localeCompare(y.reference));
    }

    async dataAnalyzer(pkgName, pkgVersion) {
        let pkg = await dbService.getPackageByNameVersion(pkgName, pkgVersion);
        if (!pkg) {
            pkg = await dataAnalyzer(pkgName, pkgVersion);
            await dbService.createPackage(pkgName, pkgVersion, pkg);
            return pkg;
        } else {
            return pkg.heuristics;
        }
    }
}


module.exports = new HeuristicService();