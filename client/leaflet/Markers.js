const L = Object.assign({}, require('leaflet'), require("leaflet.markercluster"), require('leaflet-ajax'));
const utils = require("../utils");


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
const markers = L.markerClusterGroup({
	maxClusterRadius: 120,
	/**
	 * Customize creation of clusters
	 * @param cluster
	 * @returns {*}
	 */
	iconCreateFunction: function (cluster) {
		const totalCases = cluster.getTotalCases();
		const childCount = cluster.getChildCount();

		var c = ' marker-cluster-medium';
		// if (childCount < 10) {
		// 	c += 'small';
		// } else if (childCount < 100) {
		// 	c += 'medium';
		// } else {
		// 	c += 'large';
		// }

		return new L.DivIcon({
			html: `<div>
					<span class="marker-cluster-text">${utils.formatNumber(totalCases)}</span>
				</div>`,
			className: 'marker-cluster' + c,
			iconSize: new L.Point(40, 40)
		});
	}
});


/**
 * Fetch data from MongoDB
 */
fetch("/api/corona").then(response => response.json())
	.then(featureCollection => {
		const layers = L.geoJSON(featureCollection, {
			pointToLayer: function (feature, latlng) {
				const confirmed = feature.properties.confirmed;
				const marker = L.marker(latlng, {
					icon: new L.DivIcon({
						className: 'marker marker-medium',
						iconSize: new L.Point(40, 40),
						html: `<div><span class="marker-cluster-text">${utils.formatNumber(confirmed)}</span></div>`
					})
				});
				marker.bindPopup(
					`Country: <b>${feature.properties.country}</b><br />
					Confirmed: <b>${feature.properties.confirmed}</b>`
				);
				return marker;
			},
		});
		markers.addLayers(layers);
	});

module.exports = markers;


