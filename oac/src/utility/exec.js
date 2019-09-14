const { exec: execWithCallback } = require('child_process')

module.exports = function exec(cmd) {
  return new Promise((resolve, reject) => {
    execWithCallback(cmd, (error, stdout, stderr) => {
      if (error) return reject(error)
      if (stderr) return reject(stderr)
      resolve(stdout)
    })
  })
}
