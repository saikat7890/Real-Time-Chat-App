const cloudinary= require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLD_API_KEY, 
    api_secret: process.env.CLD_API_SECRET,
});
    
module.exports= cloudinary;