var express  = require('express');
var app = module.exports = express();
var router   = require('../routes');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var admin = require('firebase-admin');
var serviceAccount = require('../../serviceAccountKey.json')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
  	apiKey: "AIzaSyCVWW3FnP_A5dDLdg6MsCoHLUEEvxtt0_U",
  	authDomain: "projectgrade-6b702.firebaseapp.com",
	databaseURL: "https://projectgrade-6b702.firebaseio.com",
	storageBucket: "projectgrade-6b702.appspot.com",
});

app.set('port', process.env.PORT || 8080 );
app.set('views', __dirname + '/../views' );
app.set('view engine', 'ejs' );
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join( __dirname, '/../../public' )));
app.use(express.static(path.join( __dirname, '/../../node_modules' )));
app.use(router);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port: ' + app.get('port'));
});