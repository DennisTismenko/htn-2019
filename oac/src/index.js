const debug = require('debug')('main');
const fs = require('fs');
const npmRegistry = require('./utility/npmRegistry');
const npmClone = require('./utility/npmClone');
const gitClone = require('./utility/gitClone');
const validatePkg = require('./utility/validatePkg');
const validateVersion = require('./utility/validateVersion');
const heuristics = require('./heuristic');

module.exports = async function main(pkgName, pkgVersion) {
  try {
    debug('package name', JSON.stringify(pkgName));
    debug('package version', JSON.stringify(pkgVersion));
    if (!validatePkg(pkgName) || !validateVersion(pkgVersion)) {
      throw new Error('Package name or version is valid');
    }

    const pkg = await npmRegistry(pkgName, pkgVersion);
    debug('package repository', JSON.stringify(pkg.repository));
    debug('package git head', JSON.stringify(pkg.gitHead));
    if (pkg.repository == null || pkg.repository.type !== 'git' || pkg.gitHead == null) {
      throw new Error('Package is not using git');
    }

    const tmpDir = fs.mkdtempSync(`${pkgName}@${pkgVersion}-`);
    debug('make temporary directory', JSON.stringify(tmpDir));
    
    const tmpPkgDir = `${tmpDir}/pkg`;
    fs.mkdirSync(tmpPkgDir);
    debug('download npm package', JSON.stringify(pkg.dist.tarball));
    await npmClone(pkg.dist.tarball, tmpPkgDir);

    const tmpRepoDir = `${tmpDir}/repo`;
    fs.mkdirSync(tmpRepoDir);
    debug('download git repository', JSON.stringify(pkg.repository.url));
    await gitClone(pkg.repository.url, pkg.gitHead, tmpRepoDir);

    const context = {
      pkg,
      pkgDir: tmpPkgDir,
      repoDir: tmpRepoDir,
    };

    return await heuristics(context);
  } catch (err) {
    throw err;
  }
}
