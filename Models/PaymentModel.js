const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    landlordAgreementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LandlordLeaseAgreement',
        required: true
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant', 
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        enum: ['rent', 'security deposit'],
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        required: true
    }
}, { timestamps: true });

const paymentSchemaModel = mongoose.model('Payment', paymentSchema);

 module.exports = paymentSchemaModel;