const plotly = require("plotly.js-basic-dist");

class Chart {

	constructor(div, layout, url) {
		this.div = div;
		this.layout = layout;
		fetch(url)
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

	setVerticleLine(date) {
		const dateString = $.format.date(date, "yyyy-MM-dd");
		const prevLayout = document.getElementById(this.div).layout;
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
						color: prevLayout.shapes[0].line.color,
						width: prevLayout.shapes[0].line.width
					}
				}
			]
		});
		this.date = date;
	}

	transformData(feature) {
		throw Error("transformDate() Needs to be implemented!")
	}
}

module.exports = Chart;