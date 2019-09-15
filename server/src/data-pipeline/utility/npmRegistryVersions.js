const npmRegistry = require('./npmRegistry');

const cache = {};

module.exports = async function npmRegistryVersions(pkgName) {
    if (cache[pkgName]) {
        return cache[pkgName];
    }
    const pkg = await npmRegistry(pkgName, '');
    const versions = Object.keys(pkg.versions);
    cache[pkgName] = versions;
    return versions;
}
