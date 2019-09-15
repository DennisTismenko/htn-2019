const fs = require('fs');
const util = require('util');
const category = "risk";
const gypFile = "binding.gyp";

module.exports = async function gypHeuristics(context) {
    try {
        await util.promisify(fs.access)(`${context.repoDir}/${gypFile}`, fs.constants.F_OK);
        return {
            severity: 'high',
            category,
            reference: JSON.stringify([context.pkg.name, context.pkg.version, 'gyp' ]),
            message: 'gyp build files from native modules may execute arbitrary code and also run on install.',
            url: `https://www.npmjs.com/package/${context.pkg.name}/v/${context.pkg.version}`,
        };
    } catch (err) {
        if (err.code === 'ENOENT') {
            return [];
        }
        throw err;
    }
}