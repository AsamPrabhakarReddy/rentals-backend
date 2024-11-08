
const mongoose = require('mongoose');

const connectDB = async() =>{
   try{
   await mongoose.connect("mongodb+srv://admin:cdnrma@cdn-rma.qcc0w.mongodb.net/?retryWrites=true&w=majority&appName=CDN-RMA") 
    console.log("MongoDB connected");
    } catch (err) {
    console.error("MongoDB connection error:", err);
    }
}

module.exports = connectDB;