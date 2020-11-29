const express = require("express");
const router = express.Router();

const ordersController = require("../controllers/ordersController");
const isAuth = require("../middleware/isAuth").isAuth;

router.get("/orders", isAuth, ordersController.getOrders);
router.post("/orders", ordersController.postOrders);
router.get("/orders/:orderId", isAuth, ordersController.getOrdersDetails);
router.post("/deleteOrders", isAuth, ordersController.postDeleteOrder);
router.post("/payment", isAuth, ordersController.postPayment);

module.exports = router;