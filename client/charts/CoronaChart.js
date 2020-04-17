require('chart.js');
require('chartjs-plugin-colorschemes');
const utils = require("../utils");

/**
 * Class that implements Chart.js
 */
class CoronaChart {

	constructor() {
		this.chart = null;
		this.title = $("h1#corona-title");
		this.canvas = $("canvas#corona-chart")[0];
		this.createChart();
	}

	setTitle(title) {
		this.title.html(title);
	}

	createChart() {
		this.chart = new Chart(this.canvas.getContext("2d"), {
			type: 'line',
			data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [{
					label: 'My First dataset',
					backgroundColor: window.chartColors.red,
					borderColor: window.chartColors.red,
					data: [
						utils.randomScalingFactor(),
						utils.randomScalingFactor(),
						utils.randomScalingFactor(),
						utils.randomScalingFactor(),
						utils.randomScalingFactor(),
						utils.randomScalingFactor(),
						utils.randomScalingFactor()
					],
					fill: false,
				}, {
					label: 'My Second dataset',
					fill: false,
					backgroundColor: window.chartColors.blue,
					borderColor: window.chartColors.blue,
					data: [
						utils.randomScalingFactor(),
						utils.randomScalingFactor(),
						utils.randomScalingFactor(),
						utils.randomScalingFactor(),
						utils.randomScalingFactor(),
						utils.randomScalingFactor(),
						utils.randomScalingFactor()
					],
				}]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'Chart.js Line Chart'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Month'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Value'
						}
					}]
				}
			}
		});
		this.afterBuildTicks = this.chart.config.options.scales.yAxes[0].afterBuildTicks;
	}

	contains(label) {
		return this.chart.data.datasets.some(ds => ds.label === label);
	}

	setData(datasets) {
		this.chart.data.datasets = datasets;
		this.chart.update();
	}

	addDataset(dataset) {
		this.chart.data.datasets.push(dataset);
		this.chart.update();
	}

	removeData(label) {
		this.chart.data.datasets = this.chart.data.datasets.filter(ds => ds.label !== label);
		this.chart.update();
	}

	clear() {
		this.chart.data.datasets = [];
		this.chart.update();
	}
}


module.exports = new CoronaChart();