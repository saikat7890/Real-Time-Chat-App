// const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require('./../config/generateToken');
const  cloudinary = require("../config/cloudinary");
const fs = require('fs');
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/email");
const crypto = require('crypto')
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

const removeFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if(err) {
            console.error("File not deleted"); 
        } else {
            console.log("File was deleted");
        }
    })
}
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        let avatarUrl = '';
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "avatars",
                    resource_type: "image"
                });
                avatarUrl = result.secure_url;
            } catch (err) {
                console.error("Cloudinary upload failed:", err);
                removeFile(req.file.path);
                return res.status(500).json({ message: "Image upload failed" });
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            pic: avatarUrl || undefined,
        });

        if (user) {
            console.log("User created successfully:", user);
            
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
            });
        } else {
            return res.status(400).json({ message: "Failed to create user." });
        }
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: "Server error during registration" });
    }
};

const logInUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id),
            });
        } else {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error during login" });
    }
};

const verify = async (req, res) => {
    try {
        const testToken = req.headers.authorization;

        let token;
        if(testToken && testToken.startsWith('Bearer')){
            token = testToken.split(' ')[1];
        }
        
        if (!token) {
            return res.status(401).json({ message: "Token required" });
        }
        const  decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        let user = await User.findById(decoded.id).select("-password");
        
        if(!user){
            return res.status(401).json({message: `The user with given token does not exists`})
        }
        
        user = user.toObject();
        user.token = token;
        console.log(user);
        
        req.user = user;
        return res.json(user);
    } catch(err) {
        console.error(err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// /api/user?search=saikat
const searchUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            {name: { $regex: req.query.search, $options: "i"} },
            // {email: { $regex: req.query.search, $options: "i"} },
        ]
    } : {};
    console.log(keyword);
    

    const users = await User.find(keyword).find({_id:{$ne:req.user._id}});
    res.send(users);
}

const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            res.status(401).json({message: 'We could not find the user with given email'})
        }
        const resetToken = user.createResetPasswordToken();
        await user.save({validateBeforeSave: false});

        const resetUrl = `${process.env.CLIENT_URL}/resetpassword/${user.id}/${resetToken}`;
        const message = `We have received password reset request. Please use the below link to reset your password\n\n${resetUrl}\n\n this reset password link will be valid for only 10 minutes.`;
        try {
            await sendEmail({
                email: user.email,
                subject: `Password change request received`,
                message: message,
            });
            
            res.status(200).json({
                status: 'success',
                message: `password reset link send to the user email`
            });
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetTokenExpires= undefined;
            user.save({validateBeforeSave: false});
    
            console.log(error);
            return res.status(401).json({message: `There was an error sending password email: Please try again later`})
        }
    } catch (error) {
        console.error(error);
    }
    
}
const resetPassword = async (req, res) => {
    console.log('resetpassword');
    try {
        const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
        
        const user = await User.findOne({passwordResetToken: token, passwordResetTokenExpires: {$gt: Date.now()}});
        if(!user){
            return res.status(401).json({message: "Token is invalid or has expired"})
        }
        
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.passwordChangedAt = Date.now();
        user.save();
        
        console.log(user);
        res.status(200).json({
            status: 'Password changed successfully'
        })
    } catch (error) {
        console.error(error);
    }
}
const googleSignIn = async (req, res) => {
    const {token} = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
        });
        const { name, email, picture, sub } = ticket.getPayload();
        const password= await bcrypt.hash(name, 10);
        let user = await User.findOne({email});
        if(!user){
            user = await User.create({
                name,
                email,
                password,
                pic: picture,
            });

        }
        
        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "Invalid User sign in" });
    }
}


module.exports = {registerUser, logInUser, searchUsers, verify, forgotPassword, resetPassword, googleSignIn};