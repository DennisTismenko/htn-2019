const fbaseService = require('./firebase-service');
const pkgNamingUtil = require('../util/pkgNamingUtil');

module.exports = {
    async getPackageByNameVersion(pkgName, pkgVersion) {
        return await fbaseService.fetchById(pkgNamingUtil.concatPkgVersion(pkgName, pkgVersion));
    },
    async createPackage(pkgName, pkgVersion, heuristics) {
        await fbaseService.create(pkgNamingUtil.concatPkgVersion(pkgName, pkgVersion), heuristics);
    }
};