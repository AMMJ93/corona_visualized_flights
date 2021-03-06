const username = require("./plotly-secret").username;
const apikey = require("./plotly-secret").api_key;
const Chart = require("./Chart");

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
			yref: "paper",
			y0: 0,
			y1: 1,
			x0: "2020-4-17",
			x1: "2020-4-17",
			line: {
				color: 'rgb(255, 0, 0)',
				width: 1
			}
		},],
	title: {
		text: 'Outgoing flights',
		font: {
			family: 'Helvetica',
			size: 24
		},
		xref: 'paper',
		x: 0.3,
	},
	// updatemenus: updatemenus,
	xaxis: {
		showline: true,
		// zeroline: true,
		// zerolinecolor: '#000',
		// zerolinewidth: 8,
		rangemode: 'tozero',
		// autorange: true,
		showgrid: false,
		range: ["2020-01-22 12:00:43.5045", "2020-04-18 12:00:43.5045"], // new Date(Date())],
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
		rangemode: 'tozero',
		ticks: 'outside',
		tickcolor: '#000',
		showline: true,
		title: {
			text: 'Number of flights',
			font: {
				family: 'Helvetica',
				size: 18,
				color: '#7f7f7f'
			}
		},
	}
};


class OutgoingFlightChart extends Chart {

	transformData(feature) {
		let xTrace = [];
		let yTrace = [];

		for (let date = 0; date < feature.properties.outgoing_flights.length; date++) {
			yTrace.push(feature.properties.outgoing_flights[date].count);
			xTrace.push(feature.properties.outgoing_flights[date].date);
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

module.exports = new OutgoingFlightChart('outgoing-flights-chart', layout, "/api/corona/Netherlands");