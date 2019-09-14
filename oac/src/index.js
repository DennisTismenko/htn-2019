const debug = require('debug')('main');
const fs = require('fs');
const npmRegistry = require('./utility/npmRegistry');
const npmClone = require('./utility/npmClone');
const gitClone = require('./utility/gitClone');
const validatePkg = require('./utility/validatePkg');
const validateVersion = require('./utility/validateVersion');
const heuristics = require('./heuristic');
require('dotenv').config();

module.exports = async function main(pkgName, pkgVersion, localDirectory=undefined) {
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

    let tmpDir = localDirectory;
    const tmpPkgDirName = 'pkg';
    let tmpPkgDir;
    const tmpRepoDirName = 'repo';
    let tmpRepoDir;
    if (tmpDir == null) {
      tmpDir = fs.mkdtempSync(`${pkgName}@${pkgVersion}-`);
      debug('new temporary directory', JSON.stringify(tmpDir));

      debug('download npm package', JSON.stringify(pkg.dist.tarball));
      tmpPkgDir = `${tmpDir}/${tmpPkgDirName}`;
      fs.mkdirSync(tmpPkgDir);
      await npmClone(pkg.dist.tarball, tmpPkgDir);
      
      debug('download git repository', JSON.stringify(pkg.repository.url));
      tmpRepoDir = `${tmpDir}/${tmpRepoDirName}`;
      fs.mkdirSync(tmpRepoDir);
      await gitClone(pkg.repository.url, pkg.gitHead, tmpRepoDir);
    } else {
      debug('use existing temporary directory', JSON.stringify(tmpDir));
      tmpPkgDir = `${localDirectory}/${tmpPkgDirName}`;
      tmpRepoDir = `${localDirectory}/${tmpRepoDirName}`;
    }

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
