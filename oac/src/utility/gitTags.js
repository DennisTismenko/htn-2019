const git = require('simple-git');

module.exports = function gitTags(localDir) {
  return new Promise((resolve, reject) => {
    git(localDir)
      .silent(true)
      .tag([], (err, tags) => {
        if (err != null) {
          reject(err);
          return;
        }
        resolve(tags.trimEnd().split('\n'));
      });
  })
}
