const config = {
  'server': {
    host: 'localhost',
    sslPort: 3000,
    port: 2999,
    workers: 2,
  },
  'ssl': {
    key: './cert/server.key',
    cert: './cert/server.cert',
  },
  'servoControlScript': './servo_control.py',
}

module.exports = config;
