const express = require("express");
const router = express.Router();
const informaition = require("./golf.informaition");

router.get("/mapview", informaition.mapview);
router.get("/course", informaition.course);
router.get("/par", informaition.par);

module.exports = router;
