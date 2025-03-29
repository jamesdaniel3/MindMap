// routes/mapRoutes.js
const Router = require("@koa/router");
const mapController = require("../controllers/mapController");

const router = new Router({
  prefix: "/maps",
});

router.get("/", mapController.getAllMaps);
router.post('/', mapController.initMap);

module.exports = router;
