const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
  "/",
  [
    body("firstname", "FirstName is Required").not().isEmpty(),
    body("lastname", "LastName is Required").not().isEmpty(),
    body("username", "UserName is Required").not().isEmpty(),
    body("email", "Please enter valid email address").isEmail(),
    body(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("User route");
  }
);

module.exports = router;
