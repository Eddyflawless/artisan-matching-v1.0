const express = require('express');

const router = express.Router();

const cors = require('cors');

router.use(cors({
	origin: [ "*"]
}));

module.exports = router;