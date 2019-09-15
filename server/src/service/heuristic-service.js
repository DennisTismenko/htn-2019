const dataAnalyzer = require('../data-pipeline');
const dbService = require('./database-service');
const npmRegistry = require('../data-pipeline/utility/npmRegistry');
const semver = require('semver');
const debug = require('debug')('main');

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
    async runDependenciesHeuristics(pkgName, version) {
        let result = [];
        queue = [[pkgName, version]]; // start BFS at source
        seenPackages = new Set();
        while (queue.length > 0) {
            let u = queue.shift();
            let name = u[0], version = u[1];
            console.log('Dequeued: ', name, version);
            let pkgInfo = await npmRegistry(name, version);
            for (let [dependencyName, range] of Object.entries(pkgInfo.dependencies)) {
                console.log(dependencyName, range);
                console.log('To enqueue ', name, version);
                let info = await npmRegistry(dependencyName, '');
                let versions = Object.keys(info.versions);
                let dependencyVersion = semver.maxSatisfying(versions, range);
                let dependency = [dependencyName, dependencyVersion];
                if (!seenPackages.has(dependency)) { // don't search duplicates
                    queue.push(dependency);
                    seenPackages.add(dependency);
                }
                console.log('queue: ' + queue);
                let val = '', item;
                for (item of seenPackages.values())
                    val += item + ', ';
                console.log('seenPackages: ' + val);
            }
            let pkg;
            for (pkg of seenPackages) {
                let [name, version] = pkg;
                pkg = await dbService.getPackageByNameVersion(name, version);
                if (!pkg) {
                    pkg = await dataAnalyzer(pkgName, version);
                    await dbService.createPackage(pkgName, version, pkg);
                    result.push(pkg);
                } else {
                    result(pkg.heuristics);
                }
            }
        }
        return result 
      
    },
        
}
