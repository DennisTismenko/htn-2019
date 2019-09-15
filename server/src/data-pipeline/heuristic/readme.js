const fs = require('fs');
const util = require('util');
const category = "quality";
const readmeFiles = [
    /^README.md$/i,
    /^READ.ME$/i,
    /^README.TXT$/i,
    /^README$/i,
    /^README.1ST$/i
];

async function readmeMissing(context) {
    const readdir = util.promisify(fs.readdir);
    const files = await readdir(context.repoDir);
    const readmeFile = files.find(file => readmeFiles.some(fn => fn.test(file)));
    if (readmeFile) {
        return [];
    } else {
        return [{
            severity: 'medium',
            category,
            reference: JSON.stringify([context.pkg.name, context.pkg.version, 'readme-missing' ]),
            message: 'missing README.md file indicates that the project lacks proper documentation.',
            url: `https://www.npmjs.com/package/${context.pkg.name}/v/${context.pkg.version}`,
        }]
    }
}


async function readmeSize(context) {
    const readdir = util.promisify(fs.readdir);
    const files = await readdir(context.repoDir);
    const readmeFile = files.find(file => readmeFiles.some(fn => fn.test(file)));
    const stat = util.promisify(fs.stat);
    const stats = await stat(`${context.repoDir}/${readmeFile}`);
    return stats.size;
}

module.exports = async function readmeHeuristics(context) {
    if (!context.repoDir) {
        return [];
    }
    let readmeHeuristic = await readmeMissing(context);
    const readmeBytesSize = await readmeSize(context);
    if (readmeBytesSize < 500) {
        readmeHeuristic.push({
            severity: 'medium',
            category,
            reference: JSON.stringify([context.pkg.name, context.pkg.version, 'readme-size', readmeBytesSize ]),
            message: 'README.md file is a substantially inadequate file size, potentially suggesting a severe lack of documentation.',
            url: `https://www.npmjs.com/package/${context.pkg.name}/v/${context.pkg.version}`,
        })
    } else if (readmeBytesSize < 1000) {
        readmeHeuristic.push({
            severity: 'low',
            category,
            reference: JSON.stringify([context.pkg.name, context.pkg.version, 'readme-size', readmeBytesSize ]),
            message: 'README.md file is an inadequate file size, potentially suggesting a lack documentation.',
            url: `https://www.npmjs.com/package/${context.pkg.name}/v/${context.pkg.version}`,
        })
    }
    return readmeHeuristic;
}