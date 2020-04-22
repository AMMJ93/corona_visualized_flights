const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coronaSchema = new Schema({
	_id: Schema.Types.ObjectId,
	type: String,
	properties: {
		id: Number,
		country: String,
		last_update: String,
		lat: Number,
		lon: Number,
		confirmed: Number,
		deaths: Number,
		recovered: Number,
		corona_cases: [],
		corona_deaths: [],
		airports: {},
		total_flights: []
	},
	geometry: {
		type: {$type: String},
		coordinates: []
	},
}, {typeKey: '$type'});

const coronaModel = mongoose.model('Corona', coronaSchema, 'corona');

module.exports = {coronaModel};