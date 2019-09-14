// const httpReq = require('../util/http-req');
const REGISTRY_BASE_URL = 'https://registry.npmjs.org/';

module.exports = {
    analyze(npmPackage) {
        httpReq.get(`${REGISTRY_BASE_URL}/${npmPackage.packageName}`);
    }
} 