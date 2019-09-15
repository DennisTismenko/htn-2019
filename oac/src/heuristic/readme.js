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
let readmeFileCached = false;
let readmeFile;


async function readmeExists(context) {
    const readdir = util.promisify(fs.readdir);
    const files = await readdir(context.repoDir);
    readmeFile = files.find(file => {
        return readmeFiles.some(fn => fn.test(file));
    });
    if (readmeFile) {
        readmeFileCached = true;
        return [];
    } else {
        return {
            severity: 'medium',
            category,
            reference: JSON.stringify({ readmeExists: false }),
            message: 'missing README.md file indicates that the project lacks proper documentation.',
        }
    }
}


async function readmeSize(context) {
    if (readmeFileCached) {
        const stat = util.promisify(fs.stat);
        const stats = await stat(`${context.repoDir}/${readmeFile}`);
        return stats.size;
    }
    return [];
}

module.exports = async function readmeHeuristics(context) {
    if (!context.repoDir) {
        return [];
    }
    let readmeExistsHeuristic = await readmeExists(context);
    if (readmeExistsHeuristic) {
        const readmeBytesSize = await readmeSize(context);
        if (readmeBytesSize < 500) {
            return {
                severity: 'medium',
                category,
                reference: JSON.stringify({ readmeSize: readmeBytesSize }),
                message: 'README.md file is a substantially inadequate file size, potentially suggesting a severe lack of documentation.'
            }
        } else if (readmeBytesSize < 1000) {
            return {
                severity: 'low',
                category,
                reference: JSON.stringify( {readmeSize: readmeBytesSize }),
                message: 'README.md file is an inadequate file size, potentially suggesting a lack documentation.'
            }
        } else {
            return [];
        }
    } else {
        return readmeExistsHeuristic;
    }
}