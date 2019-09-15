module.exports = {
    fileExists: filePath => {
        try {
            await util.promisify(fs.access)(filePath, fs.constants.F_OK);
            return true;
        } catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err
        }
        
    }
}