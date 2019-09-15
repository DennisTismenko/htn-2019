const fs = require('fs');
const util = require('util');

module.exports = function fileExists(path) => {
  try {
    await util.promisify(fs.access)(path, fs.constants.F_OK);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err
  }
}
