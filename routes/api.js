const express = require('express');
const router = express.Router();
const fs = require('fs');
const mongoose = require('mongoose');
const models = require("../models/Models");
const env = process.env;


/*****************************************
 *          MongoDB Setup
 ****************************************/
let dbURL = `mongodb://${env.mongo_host}:${env.mongo_port}/corona_visualized`;
let db = mongoose.connection;

let connectWithRetry = function () {
	return mongoose.connect(dbURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		user: env.mongo_user,
		pass: env.mongo_pass,
		authSource: "admin"
	}, function (error) {
		if (error) {
			console.error('Failed to connect to mongo on startup - retrying in 5 sec: ' + error);
			setTimeout(connectWithRetry, 5000);
		}
	});
};
connectWithRetry();


/*****************************************
 * Handle different connection responses
 ****************************************/
db.on('connecting', function () {
	console.log('Connecting to MongoDB...');
});

db.on('connected', function () {
	console.log(`MongoDB is connected! Visit http://localhost:${env.port}/`);
});
db.on('reconnected', function () {
	console.log('MongoDB is reconnected!');
});
db.on('disconnected', function () {
	console.log('MongoDB is disconnected!');
});


/****************************************
 *          Define routes
 ***************************************/
router.get('/', function (req, res, next) {
	res.json({
		key: 10
	});
});

/**
 * Routes that use MongoDB
 */
router.get('/corona', function (req, res, next) {
	/**
	 * Get data from MongoDB
	 * Returns all countries
	 */
	models.coronaModel.find({}, function (err, docs) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {
			res.json({
				type: "FeatureCollection",
				// features: correctDocs(docs),
				features: docs,
				name: "countries"
			});
		}
	});
});

router.get('/corona/:country', function (req, res, next) {
	/**
	 * Get data from MongoDB
	 * filter for one country
	 */
	models.coronaModel.find({'properties.country': req.params.country}, function (err, docs) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {
			res.json(docs[0]);
		}
	});
});

/**
 * Routes that use file-system
 */
router.get('/cases', function (req, res, next) {
	/**
	 * Reading from a file
	 */
	fs.readFile("./coronadata/country_death_cases.geojson", (err, raw) => {
		res.json(JSON.parse(raw));
	});
});

router.get('/:country', function (req, res, next) {
	/**
	 * Reading from a file
	 */
	fs.readFile("./coronadata/country_death_cases.geojson", (err, raw) => {
		const features = JSON.parse(raw)["features"];
		let response = [];
		features.forEach(feature => {
			if (feature.properties.Country_Re === req.params.country) {
				response.push(feature);
			}
		});
		res.json(response);
	});
});

module.exports = router;