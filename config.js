const config = {
  'server': {
    host: 'localhost',
    sslPort: 3000,
    port: 2999,
    workers: 2,
  },
  'ssl': {
    key: '/Users/cnoss/ssl-certificate/server.key',
    cert: '/Users/cnoss/ssl-certificate/server.crt',
  },
  'servoControlScript': './servo_control.py',
}

module.exports = config;
