const username = require("./plotly-secret").username;
const apikey = require("./plotly-secret").api_key;
const utils = require("../utils");
/**
 * This chart works with Plotly
 */
const plotly = require("plotly.js-basic-dist");

class CoronaChart {

	constructor() {
		this.div = 'corona-chart';
		this.date = '2020-02-04';
		this.layout = {
			// width: 800,
			// height: 1000,
			responsive: false,
			autosize: true,
			showlegend: true,
			shapes: [
				// 1st highlight during Feb 4 - Feb 6
				{
					type: 'line',
					x0: "2020-03-22",
					yref:"paper",
					y0: 0,
					x1: "2020-03-22",
					y1: 1,
					line: {
					  color: 'rgb(255, 0, 0)',
					  width: 1
					}
				  },],
			title: {
				text:'Corona cases over time',
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

<<<<<<< HEAD
	

}


// plot all data
function plotData(data) {

	// UPDATE BUTTON
	var updatemenus = [
		{
			buttons: [
=======
	setVerticleLine(date) {
		const dateString = $.format.date(date, "yyyy-MM-dd");
		plotly.relayout(this.div, {
			shapes: [
>>>>>>> 14647770abacc90fa8abdd53006c284b2b4d8e97
				{
					type: 'line',
					yref: 'paper',
					x0: dateString,
					x1: dateString,
					y0: 0,
					y1: 1,
					line: {
						color: 'rgb(55, 128, 191)',
						width: 3
					}
				}
			]
		});
		this.date = date;
	}

	traverseLine() {
		const oldDate = new Date(this.date);
		oldDate.setDate(oldDate.getDate() + 1);
		this.setVerticleLine(oldDate);
	}

}

module.exports = new CoronaChart();