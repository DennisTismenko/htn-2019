const fs = require('fs');
const util = require('util');
const category = "risk";
const readmeFile = "README.md";

module.exports = async function gypHeuristics(context) {
    let gypExists;
    try {
        await util.promisify(fs.access)(`${context.repoDir}/${gypFile}`, fs.constants.F_OK);
        return {
            severity: 'high',
            category,
            reference: JSON.stringify({ gyp: true }),
            message: 'gyp build files from native modules may execute arbitrary code and also run on install.',
            url: 'https://github.com/nodejs/node-gyp'
        };
    } catch (err) {
        if (err.code === 'ENOENT') {
            return [];
        }
        throw err;
    }
}