const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const authenticateUser = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authenticateUser, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

module.exports = router;