const debug = require('debug')('main');
const fs = require('fs');
const path = require('path');
const npmRegistry = require('./utility/npmRegistry');
const npmClone = require('./utility/npmClone');
const gitClone = require('./utility/gitClone');
const validatePkg = require('./utility/validatePkg');
const validateVersion = require('./utility/validateVersion');
const fileExists = require('./utility/fileExists');
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

    let tmpDir = localDirectory;
    const tmpPkgDirName = 'pkg';
    let tmpPkgDir = null;
    const tmpRepoDirName = 'repo';
    let tmpRepoDir = null;
    if (tmpDir == null) {
      tmpDir = fs.mkdtempSync(`/tmp/${pkgName}@${pkgVersion}-`);
      debug('new temporary directory', JSON.stringify(tmpDir));

      debug('download npm package', JSON.stringify(pkg.dist.tarball));
      tmpPkgDir = `${tmpDir}/${tmpPkgDirName}`;
      fs.mkdirSync(tmpPkgDir);
      await npmClone(pkg.dist.tarball, tmpPkgDir);
      
      try {
        if (pkg.repository != null && pkg.repository.type === 'git' && pkg.gitHead != null) {
          debug('package repository', JSON.stringify(pkg.repository));
          debug('package git head', JSON.stringify(pkg.gitHead));
          debug('download git repository', JSON.stringify(pkg.repository.url));
          tmpRepoDir = `${tmpDir}/${tmpRepoDirName}`;
          fs.mkdirSync(tmpRepoDir);
          await gitClone(pkg.repository.url, pkg.gitHead, tmpRepoDir);
        }
      } catch (err) {
        tmpRepoDir = null;
      }
    } else {
      debug('use existing temporary directory', JSON.stringify(tmpDir));
      tmpPkgDir = `${localDirectory}/${tmpPkgDirName}`;
      tmpRepoDir = `${localDirectory}/${tmpRepoDirName}`;
      if (!(await fileExists(tmpRepoDir))) {
        tmpRepoDir = null;
      }
    }

    const context = {
      pkg,
      pkgDir: path.resolve(tmpPkgDir),
      repoDir: tmpRepoDir && path.resolve(tmpRepoDir),
    };

    return await heuristics(context);
  } catch (err) {
    throw err;
  }
}
