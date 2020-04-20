const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', function (req, res, next) {
	res.json({
		key: 10
	});
});

router.get('/cases', function (req, res, next) {
	fs.readFile("./coronadata/country_death_cases.geojson", (err, raw) =>{
		res.json(JSON.parse(raw));
	});
});

router.get('/:country', function (req, res, next) {
	fs.readFile("./coronadata/country_death_cases.geojson", (err, raw) =>{
		const features = JSON.parse(raw)["features"];
		let response = [];
		features.forEach(feature => {
			if(feature.properties.Country_Re === req.params.country){
				response.push(feature);
			}
		});
		res.json(response);
	});
});

module.exports = router;