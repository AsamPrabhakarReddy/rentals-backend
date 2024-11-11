const mongoose = require('mongoose');

const TenantLeaseModel = mongoose.Schema({
    propertyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Property',
        required:'true'
    },
    tenantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tenant',
        required:'true'
    },
    landlordLeaseAgreementId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'LandlordLeaseAgreement',
        required:'true'
    },
    leaseTerms:{
        type:String,
        required:true
    },
    AcceptanceStatus:{
        type:String,
        enum:['Accept', 'Disagree'],
        required:'true',
        
    },
    Signature:{
        type:String,
        required:true
    }

})

const tenantLeaseModelSchema = mongoose.model('TenantLeaseAgreement', TenantLeaseModel);

module.exports = tenantLeaseModelSchema;