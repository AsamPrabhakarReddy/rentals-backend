const mongoose = require('mongoose');

const LeaseTermModel = new mongoose.Schema({
    Duration:{
        type: String,
        required:true   
    },
    LateFeePolicy:{
        type: String,
        required:true
    },
    RentIncreasePolicy:{
        type: String,
        required:true
    },
    RenewalOption:{
        type: String,
        required:true
    },
    PropertyID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Property',
        required:'true'
    }
}, {timestamps:true}
)

const LeaseTermModelSchema = mongoose.model('LeaseTerm', LeaseTermModel);

module.exports = LeaseTermModelSchema;