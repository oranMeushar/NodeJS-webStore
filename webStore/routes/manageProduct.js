const express = require("express");
const router = express.Router();

const manageProductController = require("../controllers/manageProductController");
const upload = require("../util/fileManager");
const isAdmin = require("../middleware/isAuth").isAdmin;

router.get("/manageProduct", isAdmin, manageProductController.getManageProduct);
router.get("/editProduct/:id", isAdmin, manageProductController.getEditProduct);
router.post("/editProduct", upload.single('image'), manageProductController.postEditProduct);
router.post("/deleteItem", manageProductController.postDeleteItem);

module.exports = router;