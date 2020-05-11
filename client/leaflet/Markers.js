const L = Object.assign({}, require('leaflet'), require('leaflet-ajax'), require('leaflet-timedimension'));
const utils = require("../utils");
const coronaChart = require("../charts/CoronaChart");
const incomingchart = require("../charts/IncomingFlightChart");
const outgoingchart = require("../charts/OutgoingFlightChart");
const map = require("./Map");

const colors = ['255,255,163', '255,255,163', '255,237,160', '254,217,118', '254,178,76', '253,141,60', '252,78,42', '227,26,28', '189,0,38', '128,0,38'];
const sizes = ["20px", "25px", "30px", "35px", "40px", "45px", "50px", "55px", "60px", "70px"];
let bins = [0, 50, 100, 200, 500, 1000, 10000, 50000, 150000, 200000];
let markerTimeLayer;

function createBins(featureCollection) {
	const max = Math.max.apply(Math, featureCollection["features"].map(feature => feature.properties.confirmed));
	const binSize = max / (colors.length - 1);
	bins = [...Array(colors.length - 1).keys()];
	for (const i in bins) {
		bins[i] = (i * binSize + 1);
	}
	console.log(bins);
}

/**
 * Returns the background color for the marker
 * @param confirmed value of marker
 * @param opacity 0 -> 1
 * @returns {String} color
 */
function getColor(confirmed, opacity) {
	const color = confirmed > bins[bins.length - 1] ? colors[bins.length]
		: colors[bins.indexOf(bins.find(x => confirmed < x))];
	return `rgba(${color}, ${opacity})`;
}

function getIcon(confirmed) {
	const size = confirmed > bins[bins.length - 1] ? sizes[bins.length]
		: sizes[bins.indexOf(bins.find(x => confirmed < x))];

	return new L.DivIcon({
		iconSize: [size, size],
		className: 'country-markers',
		// popupAnchor: [5, -1],
		html: `<div class="circle" style="background: ${getColor(confirmed, 0.6)}; width: ${size}; height:${size}; line-height:${size}"> ${confirmed}
							</div>`
	})
}


function createLayerForDate(featureCollection, date) {
	return L.geoJSON(featureCollection, {
		pointToLayer: (feature, latlng) => {
			const confirmed = feature.properties.corona_cases.find(d => d.date === date).count;

			const marker = L.marker(latlng, {
				icon: getIcon(confirmed)
			});

			marker.bindTooltip(
				`Country: <b>${feature.properties.country}</b><br />
					Confirmed: <b>${confirmed}</b>`
			);

			marker.on('click', function (e) {
				const feature = e.target.feature;
				if (coronaChart.contains(feature)) {
					coronaChart.removeData(feature);
					incomingchart.removeData(feature);
					outgoingchart.removeData(feature);
				} else {
					coronaChart.addData(feature);
					incomingchart.addData(feature);
					outgoingchart.addData(feature);
				}
			});
			return marker;
		}
	});
}

const MarkerTimeLayer = L.TimeDimension.Layer.extend({

	initialize: function (featureCollection, layer, options) {
		L.TimeDimension.Layer.prototype.initialize.call(this, layer, options);
		this._featureCollection = featureCollection;
		this._layers = {};
		const startDate = new Date("2020-01-22"); //YYYY-MM-DD
		const endDate = new Date("2020-04-17");
		let date = startDate;
		while (date <= endDate) {
			const dtString = $.format.date(date, "yyyy-MM-dd");
			this._layers[date.getTime()] = createLayerForDate(this._featureCollection, dtString);
			date.setDate(date.getDate() + 1);
		}
	},

	onAdd: function (map) {
		L.TimeDimension.Layer.prototype.onAdd.call(this, map);
		this._map.addLayer(this._baseLayer);
	},

	_onNewTimeLoading: function (ev) {
		var layer = this._getLayerForTime(ev.time);


		//Remove all old layers before adding new one
		Object.keys(this._layers).forEach(t => this._map.removeLayer(this._layers[t]));
		if (this._map.hasLayer(this._baseLayer)) {
			this._map.removeLayer(this._baseLayer);
		}
		if (!this._map.hasLayer(layer)) {
			this._map.addLayer(layer);
		}
	},

	_getLayerForTime: function (time) {
		if (time === 0 || time === this._defaultTime) {
			return this._baseLayer;
		}
		const date = $.format.date(new Date(time), "yyyy-MM-dd");
		if (this._layers.hasOwnProperty(time)) {
			return this._layers[time];
		}

		const newLayer = createLayerForDate(this._featureCollection, date);

		this._layers[time] = newLayer;

		return newLayer;
	},
});


/**
 * Fetch data from MongoDB
 */
fetch("/api/corona").then(response => response.json())
	.then(featureCollection => {
		const baseLayer = createLayerForDate(featureCollection, "2020-04-17");
		markerTimeLayer = new MarkerTimeLayer(featureCollection, baseLayer, {});
		markerTimeLayer.addTo(map);
	});

module.exports = markerTimeLayer;
// module.exports = markerGroup;


