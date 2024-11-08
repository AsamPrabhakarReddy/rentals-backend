const mongoose = require('mongoose');


const accountModel = mongoose.Schema({
    AccountNumber:{
        type:Number,
        required:true
    },
    IFSCCODE:{
        type:String,
        required:true
    }
}, {timestamps:true}
);

const accountModelSchema = mongoose.model('Account', accountModel);

module.exports = accountModelSchema;