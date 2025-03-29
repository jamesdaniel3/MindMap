// routes/mapRoutes.js
const Router = require("@koa/router");
const userController = require("../controllers/userController");

const router = new Router({
  prefix: "/user",
});

router.get("/", userController.getAllUsers);
// router.post("/", userController.createUser);
// router.get("/", userController.loginUser);
// router.delete('/:id', mapController.deleteMap);

module.exports = router;
