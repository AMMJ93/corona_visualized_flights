const L = Object.assign({}, require('leaflet'), require("leaflet-providers"), require('leaflet-ajax'));
const dark = L.tileLayer.provider('CartoDB.DarkMatterNoLabels'),
	light = L.tileLayer.provider('CartoDB.PositronNoLabels');

const map = L.map('map', {
	center: [52.175685, 6.673077],
	maxZoom: 17,
	minZoom: 2,
	preferCanvas: true,
	zoomControl: false,
	layers: [light]
}).setView([51.5, -0.09], 13);

map.createPane('labels');
map.getPane('labels').style.zIndex = 500;
map.getPane('labels').style.pointerEvents = 'none';

L.tileLayer.provider('CartoDB.PositronOnlyLabels', {
	attribution: 'created by Soda science',
	pane: 'labels'
}).addTo(map);


module.exports = map;