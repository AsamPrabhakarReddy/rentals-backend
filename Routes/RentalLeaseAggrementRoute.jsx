
const express = require('express');
const LandlordModel = require('../Models/LandlordModel.js');
const AccountModel = require('../Models/AccountModel.js');
const TenantModel = require('../Models/tenantModel.js');
const PropertyModel = require('../Models/PropertyModel.js');
const LeaseTermModel = require('../Models/LeaseTerm.js');
const LandlordLeaseModel = require('../Models/LandlordLeaseAgreement.js');
const TenantLeaseModel = require('../Models/TenantLeaseAgreement.js');
const PaymentModel = require('../Models/PaymentModel.js');
const BillingModel = require('../Models/BillingModel.js');
const MaintenanceModel = require('../Models/Maintenance.js');
const TenantProof = require('../Models/TenantProof.js');

const router = express.Router();

// Landlord Route

router.post('/landlord', async(req,res)=>{
    const {FirstName,MiddleName,LastName, Email, Password, Country, City, State, Pincode} = req.body;

    try {
        const existingUser = await LandlordModel.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }   

        const newUser = new LandlordModel({
            FirstName,
            MiddleName,
            LastName,
            Email,
            Password,
            Country,
            City,
            State,
            Pincode

        });

        await newUser.save();
        res.status(201).json({ message: "Landlord Added successfully" });

    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email) {
            res.status(400).json({ message: "Email already in Exits" });
        } else {
            console.log("Error while registering", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

// Account details Route

router.post('/account-details', async (req, res) => {
    try {
        
        // const landlordId = req.headers['landlordid']; [QUERY PARAMS]
        const landlordId = req.query._id || req.body.landlordId;
        const { AccountHolderName, BankName, AccountNumber} = req.body;

        if (!landlordId) {
            return res.status(400).json({ message: 'Landlord ID is required in headers' });
        }


        const newAccount = new AccountModel({
            AccountHolderName,
            BankName,
            AccountNumber
        });

        const savedAccount = await newAccount.save();

        const updatedLandlord = await LandlordModel.findByIdAndUpdate(
            landlordId,
            { AccountId: savedAccount._id },
            { new: true } 
        );

        if (!updatedLandlord) {
            return res.status(404).json({ message: 'Landlord not found' });
        }

        res.status(200).json({
            message: 'Account details added and Landlord updated',
            landlord: updatedLandlord
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Tenant Route

router.post('/tenant', async(req,res)=>{
    const {FirstName, MiddleName, LastName, Email, Password, PhoneNumber, Country, City, State, Pincode, IDProof, Status} = req.body;

    try {
        const existingUser = await TenantModel.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }   

        const newUser = new TenantModel({
            FirstName,
            MiddleName,
            LastName,
            Email,
            Password,
            PhoneNumber,
            Country,
            City,
            State,
            Pincode,
            IDProof,
            Status
        });

        await newUser.save();
        res.status(201).json({ message: "Tenant Added successfully" });

    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email) {
            res.status(400).json({ message: "Email already in Exits" });
        } else {
            console.log("Error while registering", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

// Adding property

router.post('/adding-property', async (req, res) => {
    const { PropertyType,Country, City, State, Pincode, Address, NoOfUnits, Status} = req.body;

    try {
        const landlordId = req.query._id || req.body.landlordId;
        
        if (!landlordId) {
            return res.status(400).json({ message: "Landlord ID is required" });
        }

        const landlordExists = await LandlordModel.findById(landlordId);
        if (!landlordExists) {
            return res.status(400).json({ message: "Landlord does not exist" });
        }

        const newProperty = new PropertyModel({
            PropertyType,
            Country,
            City,
            State,
            Pincode,
            Address,
            NoOfUnits,
            Status,
            LandlordID: landlordId 
        });

        await newProperty.save();
        res.status(201).json({ message: "Property added successfully", property: newProperty });
    } catch (error) {
        console.error("Error while adding property:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Lease Term 

router.post('/lease-term', async(req,res)=>{
    const {Duration, LateFeePolicy, RentIncreasePolicy, RenewalOption} = req.body;
    const propertyId = req.query._id || req.body.PropertyID;
    
    if(!propertyId)
    {
        return res.status(400).json({message: "Property ID is required!"})
    }

    try{

        const newLeaseTerm = new LeaseTermModel({
            Duration,
            LateFeePolicy,
            RentIncreasePolicy,
            RenewalOption,
            PropertyID:propertyId
        });
        await newLeaseTerm.save();
        res.status(201).json({message:`Lease Term added for property id is ${propertyId}`, leaseTerm:newLeaseTerm})
    }catch(error){
        console.error("Error while adding Lease Term:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

})

// Land Lease Agreement 

router.post('/landlordLeaseAgreement', async (req, res) => {
    const {
        RentAmount,
        SecurityDeposit,
        LeaseDuration,
        StartDate,
        EndDate,
        LeaseTermsAndDescription,
        Status
    } = req.body;

    const propertyId = req.query.propertyId || req.body.propertyId;
    const leaseTermID = req.query.leaseTermID || req.body.leaseTermID;

    try {
        
        if (!propertyId || !leaseTermID) {
            return res.status(400).json({ message: "PropertyID and LeaseTermID are required" });
        }

        const propertyExists = await PropertyModel.findById(propertyId);
        if (!propertyExists) {
            return res.status(400).json({ message: "Property does not exist" });
        }

        const leaseTermExists = await LeaseTermModel.findById(leaseTermID);
        if (!leaseTermExists) {
            return res.status(400).json({ message: "LeaseTerm does not exist" });
        }


        const newLandlordLeaseAgreement = new LandlordLeaseModel({
            PropertyId: propertyId,
            RentAmount,
            SecurityDeposit,
            LeaseDuration,
            StartDate,
            EndDate,
            LeaseTermsAndDescription,
            Status,
            LeaseTermID:leaseTermID
        });

        await newLandlordLeaseAgreement.save();

        res.status(201).json({ message: "Landlord Lease Agreement created successfully", LandlordLeaseAgreement: newLandlordLeaseAgreement });
    } catch (error) {
        console.error("Error while creating Landlord Lease Agreement:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// Tenant Lease Agreement 

router.post('/tenantLeaseAgreement', async (req, res) => {
    const { AcceptanceStatus, leaseTerms, Signature } = req.body;

    const propertyId = req.query.propertyId || req.body.propertyId;
    const tenantId = req.query.tenantId || req.body.tenantId;
    const landlordLeaseAgreementId = req.query.LLAID || req.body.LLAID;

    try {
  
        if (!propertyId || !tenantId || !landlordLeaseAgreementId) {
            return res.status(400).json({ message: "PropertyID, tenantId, and landlordLeaseAgreementId are required" });
        }


        const propertyExists = await PropertyModel.findById(propertyId);
        if (!propertyExists) {
            return res.status(400).json({ message: "Property does not exist" });
        }

   
        const tenantExists = await TenantModel.findById(tenantId);
        if (!tenantExists) {
            return res.status(400).json({ message: "Tenant ID does not exist" });
        }

   
        const newTenantLeaseAgreement = new TenantLeaseModel({
            AcceptanceStatus,
            leaseTerms,
            Signature,
            propertyId,
            tenantId,
            landlordLeaseAgreementId,
        });

        const saveTenantLeaseAgreement = await newTenantLeaseAgreement.save();

      
        const updatedLandlordLeaseAgreement = await LandlordLeaseModel.findByIdAndUpdate(
            landlordLeaseAgreementId,
            { LeaseAcceptanceStatus: saveTenantLeaseAgreement.AcceptanceStatus },
            { new: true }
        );

        if (!updatedLandlordLeaseAgreement) {
            return res.status(400).json({ message: "Landlord Lease ID does not exist" });
        }

       
        res.status(201).json({
            message: "Tenant Lease Agreement created successfully and Landlord acceptance status updated",
            UpdatedTenantLeaseModel: updatedLandlordLeaseAgreement,
        });
    } catch (error) {
        console.error("Error while creating Tenant Lease Agreement:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Payment Route

router.post('/payment', async (req, res) => {
    const { paymentDate, amount, paymentType, status } = req.body;
    const tenantId = req.query.tenantId || req.body.tenantId;
    const landlordLeaseAgreementId = req.query.LLAID || req.body.LLAID;

    try {
        
        if (!tenantId || !landlordLeaseAgreementId) {
            return res.status(400).json({ message: "tenantId and landlordLeaseAgreementId are required" });
        }

        const tenantExists = await TenantModel.findById(tenantId);
        if (!tenantExists) {
            return res.status(400).json({ message: "Tenant does not exist" });
        }

    
        const landlordLeaseExists = await LandlordLeaseModel.findById(landlordLeaseAgreementId);
        if (!landlordLeaseExists) {
            return res.status(400).json({ message: "Landlord Lease Agreement does not exist" });
        }

        const newPayment = new PaymentModel({
            landlordAgreementId: landlordLeaseAgreementId,
            tenantId,
            paymentDate,
            amount,
            paymentType,
            status,
        });

        const savedPayment = await newPayment.save();

        res.status(201).json({
            message: "Payment created successfully",
            payment: savedPayment,
        });
    } catch (error) {
        console.error("Error while creating payment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Billing Route


router.post('/billing', async (req, res) => {

    const { billDate, dueDate, amountDue, status } = req.body;
    const tenantId = req.query.tenantId || req.body.tenantId;
    const landlordLeaseAgreementId = req.query.LLAID || req.body.LLAID;

    try {
        if (!tenantId || !landlordLeaseAgreementId) {
            return res.status(400).json({ message: "tenantId and landlordLeaseAgreementId are required" });
        }

        const tenantExists = await TenantModel.findById(tenantId);

        if (!tenantExists) {
            return res.status(400).json({ message: "Tenant does not exist" });
        }

        const landlordLeaseExists = await LandlordLeaseModel.findById(landlordLeaseAgreementId);

        if (!landlordLeaseExists) {
            return res.status(400).json({ message: "Landlord Lease Agreement does not exist" });
        }

        const newBilling = new BillingModel({
            agreementId:landlordLeaseAgreementId,
            tenantId,
            billDate,
            dueDate,
            amountDue,
            status,
        });

       
        const savedBilling = await newBilling.save();

        res.status(201).json({
            message: "Billing record created successfully",
            billing: savedBilling,
        });
    } catch (error) {
        console.error("Error while creating billing record:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Maintenance Route 


router.post('/maintenance', async (req, res) => {
    const { issueDate, issueDescription, status, closedDate } = req.body;
    const tenantId = req.query.tenantId || req.body.tenantId;
    const tenantAgreementId = req.query.tenantAgreementId || req.body.tenantAgreementId;

    try {
      
        if (!tenantId || !tenantAgreementId || !issueDate || !issueDescription || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }


        const tenantExists = await TenantModel.findById(tenantId);
        if (!tenantExists) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        const agreementExists = await TenantLeaseModel.findById(tenantAgreementId);
        if (!agreementExists) {
            return res.status(404).json({ message: "Tenant lease agreement not found" });
        }

        const newMaintenance = new MaintenanceModel({
            tenantAgreementId,
            tenantId,
            issueDate,
            issueDescription,
            status,
            closedDate
        });

        const savedMaintenance = await newMaintenance.save();

        res.status(201).json({
            message: "Maintenance request created successfully",
            maintenance: savedMaintenance,
        });
    } catch (error) {
        console.error("Error creating maintenance request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Tenant Proof

router.post('/tenantProof', async (req, res) => {
    try {
        const { proofId, proofValue, proofAttachment } = req.body;
        const tenantId = req.query.tenantId || req.body.tenantId;
        
        if (!proofId || !proofValue || !proofAttachment) {
            return res.status(400).json({ error: "All fields are required." });
        }

        
       
        const tenantExists = await TenantModel.findById(tenantId);
        if (!tenantExists) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        // Save new proof
        const tenantProof = new TenantProof({
            tenantId,
            proofId,
            proofValue,
            proofAttachment
        });

        await tenantProof.save();
        res.status(201).json({ message: "Tenant proof added successfully.", tenantProof });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error." });
    }
});

module.exports = router;