const L = Object.assign({}, require('leaflet'), require("leaflet-providers"), require('leaflet-ajax'), require('leaflet-timedimension'));
const dark = L.tileLayer.provider('CartoDB.DarkMatterNoLabels'),
	light = L.tileLayer.provider('CartoDB.PositronNoLabels');

const map = L.map('map', {
	center: [52.175685, 6.673077],
	maxZoom: 17,
	minZoom: 2,
	preferCanvas: true,
	zoomControl: false,
	layers: [light],
	timeDimension: true,
    timeDimensionOptions: {
        timeInterval: "2020-01-23/2020-04-17",
        period: "P1D",
		timeSliderDragUpdate: true
    },
    timeDimensionControl: true
}).setView([50.205, 11.425], 5);

map.createPane('labels');
map.getPane('labels').style.zIndex = 500;
map.getPane('labels').style.pointerEvents = 'none';

/**
 * Some debug to help get coords
 */
map.on('click', function (e) {
	console.log(e.latlng);
	console.log(map.getZoom());
});

L.tileLayer.provider('CartoDB.PositronOnlyLabels', {
	// attribution: 'created by Group',
	pane: 'labels'
}).addTo(map);

module.exports = map;