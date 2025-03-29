// routes/mapRoutes.js
const Router = require("@koa/router");
const userController = require("../controllers/userController");

const router = new Router({
  prefix: "/user",
});

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);

module.exports = router;
