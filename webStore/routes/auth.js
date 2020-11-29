const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.get("/signUp", authController.getSignUp);
router.post("/signUp", authController.postSignUp);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.getLogout);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/newPassword/:token", authController.getNewPassword);
router.post("/newPassword",authController.postNewPassword)

module.exports = router;