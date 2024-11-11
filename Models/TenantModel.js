const mongoose = require('mongoose');

const TenantModel = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true   
    },
    MiddleName: {
        type: String, 
    },
    LastName: {
        type: String,
        required: true   
    },
    Email:{
        type: String,
        required:true,
        unique:true
    },
    Password:{
        type: String,
        required:true
    },
    PhoneNumber:{
        type:Number,
        required:true
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
    IDProof:{
        type: String,
        required:true 
    },
    Status:{
        type: String,
        required:true 
    }

}, {timestamps:true}
)

const TenantModelSchema = mongoose.model('Tenant', TenantModel);

module.exports = TenantModelSchema;