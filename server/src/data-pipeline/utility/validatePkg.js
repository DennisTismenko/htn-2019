const validatePackageName = require('validate-npm-package-name');

module.exports = function validatePkg(packageName) {
  return validatePackageName(packageName);
}
