const mongoose = require('mongoose');

const TenantLeaseModel = mongoose.Schema({
    PropertId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Property',
        required:'true'
    },
    TenantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tenant',
        required:'true'
    },
    leaseTerms:{
        type:String,
        required:true
    },
    AcceptanaceStatus:{
        type:String,
        enum:['Accept', 'Disagree'],
        required:'true',
        
    },
    Signature:{
        type:String,
        required:true
    }

})

const tenantLeaseModelSchema = mongoose.Model('TenantLeaseAgreement', TenantLeaseModel);

module.exports = tenantLeaseModelSchema;