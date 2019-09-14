const superagent = require('superagent');
const tar = require('tar');

module.exports = async function npmClone(tarURL, localDir) {
  const stream = superagent.get(tarURL)
    .pipe(tar.x({
      strip: 1,
      C: localDir,
    }));
  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}
