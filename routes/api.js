const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
		res.json({
			key: 10
		})
	}
);

module.exports = router;