const L = Object.assign({}, require('leaflet'), require("leaflet.markercluster"), require('leaflet-ajax'));
const utils = require("../utils");
const coronaChart = require("../charts/CoronaChart");
const incomingchart = require("../charts/IncomingFlightChart");
const outgoingchart = require("../charts/OutgoingFlightChart");
const map = require("./Map");

const colors = ['255,255,178', '254,217,118', '254,178,76', '253,141,60', '240,59,32', '189,0,38'];
let bins = [];
let markers;

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

/**
 * Add custom functions to MarkerCluster struct
 */
L.MarkerCluster.include({
	getTotalCases: function () {
		let total = 0;
		this.getAllChildMarkers().forEach(child => {
			total += child.feature.properties.confirmed;
		});
		return total;
	},
});

/**
 * Create MarkerClusterGroup variable
 * @type {L.MarkerClusterGroup}
 */
let markerGroup = L.layerGroup();
// const markers = L.markerClusterGroup({
// 	maxClusterRadius: 120,
// 	showCoverageOnHover: false,
// 	/**
// 	 * Customize creation of clusters
// 	 * @param cluster
// 	 * @returns {*}
// 	 */
// 	iconCreateFunction: function (cluster) {
// 		const totalCases = cluster.getTotalCases();
//
// 		return new L.DivIcon({
// 			iconSize: new L.Point(40, 40),
// 			className: 'marker marker-cluster',
// 			html: `<div>
// 					<span class="marker-cluster-text">${utils.formatNumber(totalCases)}</span>
// 				</div>`
// 		});
// 	}
// });

/**
 * Fetch data from MongoDB
 */
fetch("/api/corona").then(response => response.json())
	.then(featureCollection => {
		createBins(featureCollection);
		markers = L.geoJSON(featureCollection, {
			pointToLayer: function (feature, latlng) {
				const confirmed = feature.properties.confirmed;
				const marker = L.marker(latlng, {
					icon: new L.DivIcon({
						iconSize: new L.Point(40, 40),
						className: 'country-markers',
						html: `<div class="marker marker-single" style="background-color: ${getColor(confirmed, 0.4)}">
								<div style="background-color: ${getColor(confirmed, 0.7)}">
									<span class="marker-cluster-text">${utils.formatNumber(confirmed)}</span>
								</div>
							</div>`
					})
				});
				marker.bindPopup(
					`Country: <b>${feature.properties.country}</b><br />
					Confirmed: <b>${feature.properties.confirmed}</b>`
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
		// markerGroup.addLayers(markers);
		map.addLayer(markers);
	});


module.exports = markers;
// module.exports = markerGroup;


