const express = require("express");

const router = express.Router();


const adminController = require("../controllers/adminController");

router.get("/admin", adminController.getAdmin);
router.get("/getUsers", adminController.getUsers);
router.post("/deleteUser", adminController.postDeleteUser);
router.get("/history/:userId", adminController.getHistory);
router.post("/deleteOrder", adminController.postDeleteOrder);
router.get("/getOrders", adminController.getOrders);
router.post("/updateOrder", adminController.postUpdateOrder);

module.exports = router;