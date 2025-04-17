const express = require('express');
const { registerUser, logInUser, searchUsers, verify, forgotPassword, resetPassword, googleSignIn } = require("../controllers/userControllers");
const { protect } = require('../middlewares/authMiddleware');
const upload  = require('../config/multerConfig');


const router = express.Router();

router.route('/')
    .post(upload.single('avatar'), registerUser)
    .get(protect, searchUsers)

router.route('/login').post(logInUser);
router.route('/verify').post(verify);
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetpassword/:id/:token').post(resetPassword);
router.route('/googlesignin').post(googleSignIn);


module.exports = router; 