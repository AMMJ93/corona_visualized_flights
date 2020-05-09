const username = require("./plotly-secret").username;
const apikey = require("./plotly-secret").api_key;
const Chart = require("./Chart");
/**
 * This chart works with Plotly
 */
const plotly = require("plotly.js-basic-dist");

class CoronaChart extends Chart {

	transformData(feature) {
		let xTrace = [];
		let yTrace = [];

		for (let date = 0; date < feature.properties.corona_cases.length; date++) {
			yTrace.push(feature.properties.corona_cases[date].count);
			xTrace.push(feature.properties.corona_cases[date].date);
		}

		const countryTrace = {
			x: xTrace,
			y: yTrace,
			type: 'scatter',
			mode: 'lines+markers',
			name: feature.properties.country
		};

		return [countryTrace];
	}
}

const layout = {
	// width: 800,
	// height: 1000,
	responsive: true,
	autosize: true,
	showlegend: true,
	shapes: [
		// 1st highlight during Feb 4 - Feb 6
		{
			type: 'line',
			x0: "2020-4-17",
			x1: "2020-4-17",
			yref: "paper",
			y0: 0,
			y1: 1,
			line: {
				color: 'rgb(255, 0, 0)',
				width: 1
			}
		},],
	title: {
		text: 'Corona cases over time',
		font: {
			family: 'Helvetica',
			size: 24
		},
		xref: 'paper',
		x: 0.3,
	},
	// updatemenus: updatemenus,
	xaxis: {
		rangemode: 'tozero',
		// autorange: true,
		showgrid: false,
		range: ["2020-01-22 12:00:43.5045", new Date(Date())],
		title: {
			text: 'Date',
			font: {
				family: 'Helvetica',
				size: 18,
				color: '#7f7f7f'
			}
		},
	},
	yaxis: {
		ticks: 'outside',
		tickcolor: '#000',
		showline: true,
		title: {
			text: 'Number of cases',
			font: {
				family: 'Helvetica',
				size: 18,
				color: '#7f7f7f'
			}
		},
	}
};

module.exports = new CoronaChart("corona-chart", layout, "/api/corona/Netherlands");