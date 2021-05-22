const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");

const router = express.Router();

// @desc  Auth with Google
// @route  GET /
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// @desc  Google Auth Callback
// @route GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  authController.renderStoreOrForm
);

// @desc  Logout User
// @route  /auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// @desc Login Page
// @route /auth/login
router.get("/login", authController.renderLogin);

module.exports = router;
