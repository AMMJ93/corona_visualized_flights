const username = require("./plotly-secret").username;
const apikey = require("./plotly-secret").api_key;
/**
 * This chart works with Plotly
 */
const plotly = require("plotly.js-basic-dist");

var trace1 = {
	x: [1, 2, 3, 4],
	y: [10, 15, 13, 17],
	type: 'scatter'
};

var trace2 = {
	x: [1, 2, 3, 4],
	y: [16, 5, 11, 9],
	type: 'scatter'
};

var data = [trace1, trace2];

plotly.newPlot('flights-chart', data);
