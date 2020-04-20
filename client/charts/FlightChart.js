const username = require("./plotly-secret").username;
const apikey = require("./plotly-secret").api_key;
/**
 * This chart works with Plotly
 */
const plotly = require("plotly.js-basic-dist");

const countries = ["Netherlands"];

// fetch all data
// fetch("/api/cases").then(response => response.json()).then(json => plotData(json))

// fetch country specific data
countries.forEach(c => {
	fetch("/api/" + c)
		.then(response => response.json())
		.then(json => plotCountryData(json));
})

// plot all data 
function plotData(data) {

	var xTrace = [];
	var yTrace = [];

	// loop through all dates
	for (let date = 0; date < data.features[0].properties.corona_cases.length; date++) {

		var cases = 0;

		// sum all corona cases for all countries on that date
		for (let country = 0; country < data.features.length; country++) {
			cases += data.features[country].properties.corona_cases[date].count
		}

		// add number of cases to yTrace and the dates from a single country (since the rest is exactly the same) to the yTrace
		xTrace.push(data.features[0].properties.corona_cases[date].date)
		yTrace.push(cases)

	}

	var fullTrace = {
		x: xTrace,
		y: yTrace,
		type: 'scatter',
		mode: 'markers',
	};

	var data = [fullTrace]

	plotly.newPlot('flights-chart', data, { displayModeBar: false });
}

// plot data for a specific country
function plotCountryData(data) {

	var xTrace = [];
	var yTrace = [];

	for (let date = 0; date < data[0].properties.corona_cases.length; date++) {
		console.log('here')
		yTrace.push(data[0].properties.corona_cases[date].count)
		xTrace.push(data[0].properties.corona_cases[date].date)
	}

	console.log(xTrace)

	var countryTrace = {
		x: xTrace,
		y: yTrace,
		type: 'scatter',
		mode: 'markers',
	};

	var data = [countryTrace]

	plotly.newPlot('flights-chart', data, { displayModeBar: false });
}
