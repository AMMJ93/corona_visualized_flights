const username = require("./plotly-secret").username;
const apikey = require("./plotly-secret").api_key;
/**
 * This chart works with Plotly
 */
const plotly = require("plotly.js-basic-dist");

class IncomingFlightChart {

	constructor() {
		this.div = 'incoming-flights-chart';
		this.layout = {		
			responsive: true,
			autosize: true,
			xaxis: {
				rangemode: 'tozero',
				autorange: true
			},
			yaxis: {
				ticks: 'outside',
				tickcolor: '#000'
			}
		};
		fetch("/api/corona/Netherlands")
			.then(response => response.json())
			.then(json => {
				const data = this.transformData(json);
				this.chart = plotly.newPlot(this.div, data, this.layout, {displayModeBar: false});
			});
	}

	getTraces() {
		return document.getElementById(this.div).data;
	}

	contains(feature) {
		const traces = this.getTraces();
		return traces.some(trace => trace.name === feature.properties.country);
	}

	removeData(feature) {
		const traces = this.getTraces();
		const index = traces.findIndex(t => t.name === feature.properties.country);
		if (index >= 0) {
			plotly.deleteTraces(this.div, index);
		}
	}

	addData(feature) {
		const data = this.transformData(feature);
		plotly.addTraces(this.div, data);
	}

	transformData(feature) {
		let xTrace = [];
		let yTrace = [];

		for (let date = 0; date < feature.properties.incoming_flights.length; date++) {
			console.log('here');
			yTrace.push(feature.properties.incoming_flights[date].count);
			xTrace.push(feature.properties.incoming_flights[date].date);
		}

		const countryTrace = {
			x: xTrace,
			y: yTrace,
			type: 'scatter',
			mode: 'markers',
			name: feature.properties.country
		};

		return [countryTrace];
	}

}


// plot all data
function plotData(data) {

	// UPDATE BUTTON
	var updatemenus = [
		{
			buttons: [
				{
					args: [],
					label: 'Visualize over time',
					method: 'update'
				},
			],
			direction: 'left',
			pad: {'l': 100},
			// showactive: true,
			type: 'buttons',
			xanchor: 'left',
			yanchor: 'top'
		},
	]

	// ACTUAL DATA
	var xTrace = [];
	var yTrace = [];

	// loops through all dates
	for (let date = 0; date < data.features[0].properties.incoming_flights.length; date++) {

		var cases = 0;

		// sum all corona cases for all countries on that date 
		// Why sum over all countries?
		for (let country = 0; country < data.features.length; country++) {
			cases += data.features[country].properties.incoming_flights[date].count
		}

		// add number of cases to yTrace and the dates from a single country (since the rest is exactly the same) to the yTrace
		xTrace.push(data.features[0].properties.incoming_flights[date].date)
		yTrace.push(cases)

	}

	// ADD DATA TO X&Y TRACES
	var fullTrace = {
		x: xTrace,
		y: yTrace,
		type: 'scatter',
		mode: 'markers',
	};

	var plotData = [fullTrace];

	// GENERAL LAYOUT


	plotly.newPlot('incoming-flights-chart', plotData, layout, {displayModeBar: false});
}

module.exports = new IncomingFlightChart();