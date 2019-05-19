/* === Extensions import === */

const config          = require('./config.js'),
      express         = require('express'),
      cluster         = require('cluster'),
      fs              = require('fs'),
      ejs             = require('ejs'),
      app             = express(),
      http            = require('http'),
      https           = require('https'),
      server          = http.createServer(app);
      io              = require('socket.io').listen(server),


/* === express configuration === */

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


/* === Routes === */

app.get('/', (req, res) => {
  res.render('index.ejs');
});


/* === 404 Route === */

//404 Route, ALWAYS KEEP AT THE BOTTOM
app.get('*', (req, res) => {
  res.status(404).send();
});


/* === Server startup === */

//Uncaught error handling
let workers = process.env.WORKERS || require('os').cpus().length;
if(workers > 4) workers = config.server.workers || 2;

if(cluster.isMaster) {
  console.log('start cluster with %s workers', workers);
  for(let i = 0; i < workers; ++i) {
    let worker = cluster.fork().process;
    console.log('worker %s started.', worker.pid);
  }
  cluster.on('exit', function(worker) {
    console.log('worker %s died. restart...', worker.process.pid);
    cluster.fork();
  });
} else {
  if (process.argv.slice(2)[0] === 'insecure') {
    let httpserver = http.createServer(app).listen(config.server.port, config.server.host);
  } else {
    let httpsserver = https.createServer({
      key: fs.readFileSync(config.ssl.key),
      cert: fs.readFileSync(config.ssl.cert)
    }, app).listen(config.server.sslPort, config.server.host);
    let httpserver = http.createServer(function(req, res) {
      res.writeHead(302, {
        'Location': `https://${config.server.host}:${config.server.port}${req.url}`,
      });
      res.end();
    }).listen(config.server.port, config.server.host);
  }
}

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
});

io.on('connection', function(socket){
  console.log('a user connected');
});
