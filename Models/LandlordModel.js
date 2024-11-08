const mongoose = require('mongoose');

const landlordModel = new mongoose.Schema({
    Fullname: {
        type: String,
        required: true   
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true 
    },
    Country:{
        type: String,
        required:true  
    },
    City: {
        type: String,
        required: true
    },
    State: {
        type: String,
        required: true
    },
    Pincode: {
        type: String,
        required: true
    },
    AccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: false,
        default: null  
    }
}, { timestamps: true });

const landlordModelSchema = mongoose.model('Landlord', landlordModel);

module.exports = landlordModelSchema;
