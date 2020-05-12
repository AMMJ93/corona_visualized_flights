const L = Object.assign({}, require('leaflet'), require("leaflet-providers"), require('leaflet-ajax'), require('leaflet-timedimension'), require('leaflet-easybutton'));
const dark = L.tileLayer.provider('CartoDB.DarkMatterNoLabels'),
	light = L.tileLayer.provider('CartoDB.PositronNoLabels');

const coronaChart = require("../charts/CoronaChart");

const map = L.map('map', {
	center: [52.175685, 6.673077],
	maxZoom: 17,
	minZoom: 2,
	preferCanvas: true,
	zoomControl: false,
	layers: [light],
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

const timeDimension = new L.TimeDimension({
	timeInterval: "2020-01-23/2020-04-17",
	period: "P1D",
	timeSliderDragUpdate: true,
	currentTime: Date.parse("2020-01-23T00:00:00Z")
});

const player = new L.TimeDimension.Player({
	// transitionTime: 100,
	loop: false,
	// startOver:true
}, timeDimension);

const timeDimensionControlOptions = {
	player: player,
	timeDimension: timeDimension,
	position: 'bottomleft',
	autoPlay: false,
	minSpeed: 1,
	speedStep: 1,
	maxSpeed: 15,
	timeSliderDragUpdate: true
};

L.Control.TimeDimension.include({
	_getDisplaySpeed: function (fps) {
		return fps + ' fps';
	},

	_getDisplayDateFormat: function (date) {
		// return date.format("dS mmmm yyyy");
		// return date.longDateFormat();
		return `<b>${$.format.date(date, "yyyy-MM-dd")}</b>`;
	}
});
const timeDimensionControl = new L.Control.TimeDimension(timeDimensionControlOptions);

map.addControl(timeDimensionControl);
map.timeDimension = timeDimension;

L.easyButton('<img src="/icons/bell.png">', function () {
	alert('You are subscribed to updates!');
}).addTo(map);


module.exports = map;