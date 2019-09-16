module.exports = {
    getNameVersion(pkgVersion) {
        const atIndex = decodeURIComponent(pkgVersion).lastIndexOf('@');
        // if string starts with the only @ symbol or does not contain @
        if (atIndex <= 0) {
            return {
                name: pkgVersion,
                version: null,
            }
        }
        return {
            name: pkgVersion.substring(0, atIndex),
            version: pkgVersion.substring(atIndex + 1),
        }
    },
    concatPkgVersion(pkgName, pkgVersion) {
        return encodeURIComponent(`${pkgName}@${pkgVersion}`);
    }
}
