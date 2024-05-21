// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/login", userController.getLoginForm);
router.post("/login", userController.login);
router.get("/sign-up", userController.getSignUpForm);
router.post("/sign-up", userController.signUp);
router.get("/account-information", userController.getAccountInformation);
router.get("/user", userController.getUser);
router.put("/update", userController.updateUser);
router.get("/isLoggedIn", userController.isLoggedIn);
router.post("/logout", userController.logout);

module.exports = router;
