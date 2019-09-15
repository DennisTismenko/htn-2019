const fbaseService = require('./firebase-service');

function concatPkgVersion(pkgName, pkgVersion) {
    return `${pkgName}@${pkgVersion}`;
}

module.exports = {
    getAllPackageByName(packageName) {
        
    },
    createPackage(pkgName, pkgVersion, heuristics) {
        fbaseService.create(concatPkgVersion(pkgName, pkgVersion), heuristics);
    }
};