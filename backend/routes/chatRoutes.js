const express = require('express');
const { 
    accessChat, 
    fetchChats, 
    createGroupChat, 
    renameGroup, 
    addToGroup,
    removeFromGroup
    } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, accessChat)
    .get(protect, fetchChats)

router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroup);
router.route('/groupadd').put(protect, addToGroup);
router.route('/groupremove').put(removeFromGroup);



module.exports = router;