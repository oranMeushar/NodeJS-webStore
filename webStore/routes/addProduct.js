const express = require("express");
const router = express.Router();
const addProductController = require("../controllers/addProductController");
const upload = require("../util/fileManager");
const isAdmin = require("../middleware/isAuth").isAdmin;

router.get("/addProduct", isAdmin, addProductController.getAddProduct);
router.post("/addProduct" , upload.single('image'), addProductController.postAddProduct);

module.exports = router;