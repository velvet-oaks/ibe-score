//Import Packages
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');
const { BSON } = require('bson');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const app = express();
// //Init DotENV
dotenv.config({
	path: path.resolve(__dirname, './.env')
});
// global.__basedir = __dirname;

// CORS and PORT retrieval
let currentDevPort = '';
const allowedOrigin = process.env.ORIGIN;
console.log(allowedOrigin);

const portExtraction = (req, res, next) => {
	// if (!req.headers.origin.includes('localhost')) {
	const port = req.headers.origin.split(':')[2] || '80';
	console.log('extracted port is...: ' + port);
	currentDevPort = port;
	console.log('currentDevPort variable for front end is...: ' + currentDevPort);
	// }
	// console.log('Port extraction by method of splitting at ":" commencing..');
	// console.log(req.headers);

	next();
};



// app.use(portMiddleware);

app.use(portExtraction);
// app.use(express.json);

app.use((req, res, next) => {
	// let allowedOrigin;
	// if (process.env.NODE_ENV === 'production') {
	// 	allowedOrigin = 'https://app.wearenv.co.uk'; // Replace with your actual production domain
	// } else {
	// 	allowedOrigin = `http://localhost:${currentDevPort}`; // Update with the correct variable or logic for development
	// }

	console.log('allowedOrigin value is...:' + allowedOrigin);
	res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin,X-Requested-With, Content-Type,Accept,Authorization, X-Port, Prod'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET,POST,PATCH,DELETE,OPTIONS,PUT'
	);
	if (req.method === 'OPTIONS') {
		res.sendStatus(200);
	} else {
		next();
	}
});

//Import Routes
// const authRoute = require('./src/routes/auth');
const authRoute = require('./src/routes/auth');
const eventRoute = require('./src/routes/event');
const p2pRoute = require('./src/routes/p2p');
const createTestUsers = require('./src/routes/testUsers');
const dealFiles = require('./src/routes/dealFiles');
const mailRoute = require('./src/routes/mailRoute');
//Initalise App

function decodeBSON(req, res, next) {
	let rawData = '';
	req.setEncoding('binary');
	req.on('data', chunk => {
		rawData += chunk;
	});
	req.on('end', () => {
		const decodedData = BSON.deserialize(Buffer.from(rawData, 'binary'));
		fs.appendFileSync('./data/data.json', JSON.stringify(decodedData));
		req.decodedData = decodedData;
		next();
	});
}

function logError(err, req, res, next) {
	if (err && err.code === 'ECONNREFUSED') {
		console.error(
			err.message,
			"Check your network. If using 'localhost' check Traefik is running."
		);
	}
	next(err);
}

app.use(logError);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post(decodeBSON);

mongoose
	.connect(process.env.CLOUD_DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Connected to Database');
	})
	.catch(err => {
		console.log('Connection Failed' + err);
		console.error(err);
	});

//Initalise Morgan and BodyParser
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static(path.join(__dirname,"../dist/brian_app")));
//Assign Routes
app.use('/ibe/api/auth', authRoute);
app.use('/ibe/api/event', eventRoute);
app.use('/ibe/api/test', createTestUsers);
app.use('/ibe/api/p2p', p2pRoute);
app.use('/ibe/api/deal_files', dealFiles);
app.use('/ibe/api/mail', mailRoute);

//Assign Angular Route

// app.use('/', express.static(path.join(__dirname, 'dist')));
app.get('*', function (req, res) {
	res.redirect('/#redirectto=main');
});

module.exports = app;
