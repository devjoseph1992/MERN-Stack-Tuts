const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const User = require("../../models/User");

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, username, email, password } = req.body;
    try {
      //See if the user exists
      let user = await User.findOne({ username, email });
      if (user) {
        return res
          .status(400)
          .json({ erros: [{ msg: "Username or email already exists" }] });
      }
      //Get user gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      user = new User({
        firstname,
        lastname,
        username,
        email,
        avatar,
        password,
      });
      // encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      // return jsonwebtoken
      res.send("User registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
