const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
},{
    timestamps: true,
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next(); 

    // encrypt the password before saving it
    this.password =await bcrypt.hash(this.password, 12);
    next();
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.methods.createResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log(resetToken);
    
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10*60*1000; //10min
    return resetToken;
}

const User = mongoose.model("User", userSchema);
module.exports = User;



