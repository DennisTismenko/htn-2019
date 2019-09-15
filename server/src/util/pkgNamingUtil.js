module.exports = {
    getNameVersion(pkgVersion) {
        let splitNameVersion = pkgVersion.split('@');
        return {
            name: splitNameVersion[0],
            version: splitNameVersion[1]
        }
    },
    concatPkgVersion(pkgName, pkgVersion) {
        return `${pkgName}@${pkgVersion}`;
    }
}