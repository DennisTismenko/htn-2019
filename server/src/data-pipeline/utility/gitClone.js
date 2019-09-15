const git = require('simple-git/promise');

module.exports = async function gitClone(repoURL, commitHash, localDir) {
  try {
    const url = repoURL.replace(/^git\+/, '');
    await git()
      .silent(true)
      .clone(url, localDir)
    await git(localDir)
      .checkout(commitHash);
  } catch (err) {
    throw err;
  }
}