var express = require('express');

var app = express();

var bodyParser = require('body-parser');
var jsonwebtoken = require("jsonwebtoken");
var path = require('path');
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json 
app.use(bodyParser.json())

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    res.setHeader('Access-Control-Expose-Headers', 'Accept-Ranges, Content-Encoding, Content-Length, Content-Range');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



var cors = require('cors');
var urls = ['http://localhost:4200', 'http://localhost:4100']
app.use(cors({ origin: urls , credentials :  true}));
//app.use(cors());

var config = require(process.cwd() + '\\common\\config');
var conString = config.db.connectionString;
var MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all('/api/admin/*', [require('./middlewares/validateRequest')]);

app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization) {
    jsonwebtoken.verify(req.headers.authorization, config.secret, function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

var imagedir = path.join(__dirname, 'uploads/images');
var notedir = path.join(__dirname, 'uploads/notes');
var facultydir = path.join(__dirname, 'uploads/faculties');
var universitydir = path.join(__dirname, 'uploads/universities');

var routes = require('./routes/gen_routes');
routes(app);

app.use('/image', express.static(imagedir));
app.use('/notes', express.static(notedir));
app.use('/faculties', express.static(facultydir));
app.use('/universities', express.static(universitydir));

app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(process.env.PORT || 3000)

if (process.env.PORT === undefined) {
    console.log("Server Started at port : " + 3000);
}
else {
    console.log("Server Started at port : " + process.env.PORT);
}
