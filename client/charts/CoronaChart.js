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
			// width: 1200,
			// height: 600,
			responsive: true,
			autosize: true,
			// updatemenus: updatemenus,
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

		for (let date = 0; date < feature.properties.corona_cases.length; date++) {
			yTrace.push(feature.properties.corona_cases[date].count);
			xTrace.push(feature.properties.corona_cases[date].date);
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

	setVerticleLine(date) {
		const dateString = $.format.date(date, "yyyy-MM-dd");
		plotly.relayout(this.div, {
			shapes: [
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