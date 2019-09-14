const superagent = require('superagent');

const NPM_REGISTRY = process.env.NPM_REGISTRY || 'https://registry.npmjs.com';

module.exports = async function npmRegistry(pkg, version) {
  const encodedPkg = encodeURIComponent(pkg);
  const encodedVersion = encodeURIComponent(version);
  const res = await superagent.get(`${NPM_REGISTRY}/${encodedPkg}/${encodedVersion}`);
  return res.body;
}
