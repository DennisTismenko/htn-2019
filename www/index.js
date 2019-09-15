/* eslint-disable */
const {WWWServer} = require('./dist/server');

module.exports = {WWWServer};

if (require.main === module) {
  const host = process.env.HOST || '127.0.0.1';
  const port = +(process.env.PORT || 1234);
  try {
    const server = new WWWServer({
      host,
      port,
    });
    server.start();
    const url = `http://${host}:${port}`;
    console.log(`Server running at ${url}`);
  } catch (err) {
    console.error('Cannot start the application.', err);
    process.exit(1);
  }
}
