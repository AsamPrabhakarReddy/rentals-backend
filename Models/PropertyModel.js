const mongoose = require('mongoose');

const PropertyModel = new mongoose.Schema({
    PropertyType:{
        type: String,
        required:true   
    },
    Country:{
        type: String,
        required:true  
    },
    City:{
        type: String,
        required:true   
    },
    State:{
        type: String,
        required:true   
    },
    Pincode:{
        type: Number,
        required:true   
    },
    Address:{
        type: String,
        required:true
    },
    NoOfUnits:{
        type:Number,
        required:true
    },
    Status:{
        type: String,
        required:true 
    },
    LandlordID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Landlord', // Foreign key reference to Landlord model
        required: true,
    }

}, {timestamps:true}
)

const PropertyModelSchema = mongoose.model('Property', PropertyModel);

module.exports = PropertyModelSchema;