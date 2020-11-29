const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/isAuth").isAuth;
const cartController = require("../controllers/cartController");

router.get("/cart", isAuth, cartController.getCart);
router.post("/addCart", cartController.postAddCart);
router.post("/deleteOne", cartController.postDeleteOne);
router.post("/deleteAll", cartController.postDeleteAll);




module.exports = router;