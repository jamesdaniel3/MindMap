// routes/mapRoutes.js
const Router = require("@koa/router");
const mapController = require("../controllers/mapController");

const router = new Router({
  prefix: "/maps",
});

router.get("/", mapController.getAllMaps);
// Add more map routes here as needed:
// router.get('/:id', mapController.getMapById);
// router.post('/', mapController.createMap);
// router.put('/:id', mapController.updateMap);
// router.delete('/:id', mapController.deleteMap);

module.exports = router;
