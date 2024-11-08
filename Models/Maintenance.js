const mongoose = require('mongoose');

const MaintenanceModel = new mongoose.Schema({
    tenantAgreementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TenantLeaseAgreement',
        required: true
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant', 
        required: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    issueDescription: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'in progress', 'resolved'],
        required: true
    },
    closedDate: {
        type: Date
    }
}, { timestamps: true });



const MaintenanceModelSchema = mongoose.model('Maintenance', MaintenanceModel);

module.exports = MaintenanceModelSchema;