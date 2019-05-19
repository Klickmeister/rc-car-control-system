/* === Extensions import === */

const config          = require('./config.js'),
      http            = require('http'),
      https           = require('https'), 
      express         = require('express'),
      cluster         = require('cluster'),
      ejs             = require('ejs'),
      app             = express(),
      server          = http.createServer(app);
  

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
  let httpsserver = http.createServer(app).listen(config.server.port);
}

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
});
