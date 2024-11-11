const mongoose = require('mongoose');


const accountModel = mongoose.Schema({
    AccountHolderName:{
        type:String,
        required:true
    },
    BankName:{
        type:String,
        required:true
    },
    AccountNumber:{
        type:Number,
        required:true
    },
}, {timestamps:true}
);

const accountModelSchema = mongoose.model('Account', accountModel);

module.exports = accountModelSchema;