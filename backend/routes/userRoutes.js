const express = require('express');
const { registerUser, logInUser, allUsers } = require("../controllers/userControllers");
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .post(registerUser)
    .get(protect, allUsers)

router.route('/login').post(logInUser);


module.exports = router; 