const mongoose = require('mongoose');

const landlordLeaseModel = mongoose.Schema({
    PropertyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Property',
        required:'true'
    },
    RentAmount:{
        type:Number,
        required:true
    },
    SecurityDeposit:{
        type:Number,
        required:true
    },
    LeaseDuration:{
        type:String,
        required:true
    },
    StartDate:{
        type:Date,
        required:true
    },
    EndDate:{
        type:Date,
        required:true
    },
    LeaseTermsAndDescription:{
        type:String,
        required:true
    },
    LeaseTermID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'LeaseTerm',
        required:'true'
    },
    LeaseAcceptanceStatus:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'TenantLeaseAgreement',
        required:false,
        default:null
    },
    Status:{
    type: String,
    enum:['Active', 'Expired', 'Terminated'],
    required:true
    },

})

const landlordLeaseModelSchema = mongoose.model('LandlordLeaseAgreement', landlordLeaseModel);

module.exports = landlordLeaseModelSchema;