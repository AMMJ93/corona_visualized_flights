const map = require("./leaflet/Map");
const markers = require("./leaflet/Markers");
const coronaChart = require("./charts/CoronaChart");
const inflightChart = require("./charts/IncomingFlightChart");
const outflightChart = require("./charts/OutgoingFlightChart");


map.timeDimension.on("timeload", function (data) {
	const date = new Date(map.timeDimension.getCurrentTime());
	console.log($.format.date(date, "yyyy-MM-dd"));
	coronaChart.setVerticleLine(date);
	inflightChart.setVerticleLine(date);
	outflightChart.setVerticleLine(date);
});