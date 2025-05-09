const asyncHandler = require("express-async-handler");
const Chat = require('../Models/chatModels');
const User = require("../Models/userModel");

const accessChat = asyncHandler(async(req, res) => {
    const {userId} = req.body;
    // console.log(userId);
    
    if(!userId) {
        console.error("UserId param not sent with request");
        return res.sendStatus(400);
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}},
        ],
    }).populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if(isChat.length > 0){
        res.send(isChat[0]);
    } else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id: createChat._id}).populate("users", "-password");
            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message)
        }
    }
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        let result = await Chat.find({users:{ $elemMatch: {$eq: req.user._id} }})
                                .populate("users", "-password")
                                .populate("groupAdmin", "-password")
                                .populate("latestMessage")
                                .sort({updatedAt: -1});

        result = await User.populate(result, {
            
            path: "latestMessage.sender",
            select: "name pic email",
        });
                                
        res.status(200).send(result);
    } catch (error) {
       res.status(400);
       throw new Error(error.message);
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields"});
    }
    // we will get a stringified array of users
    let users = JSON.parse(req.body.users);
    // console.log(users);
    

    if(users.length < 2){
        return res.status(400).send("More than 2 users are required to form a group chat");
    }
    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
       throw new Error(error.message);
    }
})

const renameGroup = asyncHandler( async (req, res) => {
    const {chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId, {chatName: chatName}, {new: true})
                                .populate("users", "-password")
                                .populate("groupAdmin", "-password");
    if(!updatedChat) {
        res.status(404);
        throw new Error("Chat not found");  
    } else {
        res.json(updatedChat);
    }
});

const addToGroup = asyncHandler(async (req,res) => {
    const {chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(chatId, {$push: {users: userId},}, {new: true})
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");

    if(!added) {
        res.status(404);
        throw new Error("Chat not found");    
    } else {
        res.json(added);
    }
})
const removeFromGroup = asyncHandler(async (req,res) => {
    const {chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId, {$pull: {users: userId},}, {new: true})
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");

    if(!removed) {
        res.status(404);
        throw new Error("Chat not found");        
    } else {
        res.json(removed);
    }
})



module.exports = {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup};