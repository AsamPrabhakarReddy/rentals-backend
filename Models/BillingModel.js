const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    agreementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LandlordLeaseAgreement', 
        required: true
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant', 
        required: true
    },
    billDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    amountDue: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['paid', 'unpaid', 'overdue'],
        required: true
    }
}, { timestamps: true });

const billingSchemaModel = mongoose.model('Billing', billingSchema);

module.exports = billingSchemaModel;
