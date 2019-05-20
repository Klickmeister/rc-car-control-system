/* === Extensions import === */

const config            = require('./config.js'),
      path            = require('path'),
      {spawn}         = require('child_process'),
      express         = require('express'),
      cluster         = require('cluster'),
      fs              = require('fs'),
      ejs             = require('ejs'),
      bodyParser      = require('body-parser'),
      app             = express(),
      sslOptions      = { key: fs.readFileSync(config.ssl.key), cert: fs.readFileSync(config.ssl.cert) },
      httpServer      = require('http').createServer(app),
      httpsServer     = require('https').createServer(sslOptions, app),
      io              = require('socket.io').listen(httpServer);


/* === express configuration === */

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

/* === Routes === */

app.get('/', (req, res) => {
  res.render('index.ejs');
});
io.listen(httpsServer);

io.on('connection', (socket) => {
  console.log('a user connected');
});


app.post('/rc', (req, res) => {

  const steering = normalize_servo_input(req.body.steering);
  const speed = normalize_servo_input(req.body.speed);

  console.log("Received CTL, ", `Steer: ${steering}`, `Speed: ${speed}`);

  const subprocess = spawn('python', [
    config.servoControlScript,
    steering,
    speed,
  ]);

  subprocess.stdout.on('data', (data) => {
    console.log(`data:${data}`);
  });

  subprocess.stderr.on('data', (data) => {
    console.log(`error:${data}`);
  });

  subprocess.stderr.on('close', () => {});

  res.status(200).send();
});

function normalize_servo_input(val) {
  // range: {-7, 7}
  if(val) {
    val = parseInt(val);

    if(val > 7) {
      val = 7;
    }
    else if(val < -7) {
      val = -7;
    }

    return val + 8;
  }
  else {
    return 8;
  }
}


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
    httpServer.listen(config.server.port, config.server.host);
  } else {
    httpsServer.listen(config.server.sslPort, config.server.host);
    httpServer.listen(config.server.port, config.server.host);
  }
}

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
});
