const mongoose = require('mongoose');

const TenantProof = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant', 
        required: true
    },
    proofId: {
        type: String,
        required: true   
    },
    proofValue:{
        type: Number,
        required:true
    },
    proofAttachment:{
        type:String,
        required:true
    }

}, {timestamps:true}
)

const TenantProofSchema = mongoose.model('TenantProof', TenantProof);

module.exports = TenantProofSchema;