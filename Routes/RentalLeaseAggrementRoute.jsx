
const express = require('express');
const LandlordModel = require('../Models/LandlordModel.js');
const AccountModel = require('../Models/AccountModel.js');
const TenantModel = require('../Models/tenantModel.js');
const PropertyModel = require('../Models/PropertyModel.js');
const LeaseTermModel = require('../Models/LeaseTerm.js');
const LandlordLeaseModel = require('../Models/LandlordLeaseAgreement.js');


const router = express.Router();

// Landlord Route

router.post('/landlord', async(req,res)=>{
    const {Fullname, Email, Password, Country, City, State, Pincode} = req.body;

    try {
        const existingUser = await LandlordModel.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }   

        const newUser = new LandlordModel({
            Fullname,
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
        const { AccountNumber, IFSCCODE } = req.body;

        if (!landlordId) {
            return res.status(400).json({ message: 'Landlord ID is required in headers' });
        }


        const newAccount = new AccountModel({
            AccountNumber,
            IFSCCODE
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
    const {Fullname, Email, Password, PhoneNumber, Country, City, State, Pincode, IDProof, Status} = req.body;

    try {
        const existingUser = await TenantModel.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }   

        const newUser = new TenantModel({
            Fullname,
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

        const tenantExists = await LeaseTermModel.findById(leaseTermID);
        if (!tenantExists) {
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


// router.post('/payment', async (req, res) => {
//     const { paymentDate, amount, paymentType, status } = req.body;

//     const agreementId = req.query.agreementId || req.body.agreementId;
//     const tenantId = req.query.tenantId || req.body.tenantId;

//     try {
       
//         if (!agreementId || !tenantId) {
//             return res.status(400).json({ message: "Agreement ID and Tenant ID are required" });
//         }

    
//         const agreementExists = await LeaseAgreementModel.findById(agreementId);
//         if (!agreementExists) {
//             return res.status(400).json({ message: "Agreement does not exist" });
//         }

//         const tenantExists = await TenantModel.findById(tenantId);
//         if (!tenantExists) {
//             return res.status(400).json({ message: "Tenant does not exist" });
//         }

//         // Create a new payment record
//         const newPayment = new PaymentModel({
//             agreementId,
//             tenantId,
//             paymentDate,
//             amount,
//             paymentType,
//             status
//         });

//         await newPayment.save();

//         res.status(201).json({ message: "Payment created successfully", payment: newPayment });
//     } catch (error) {
//         console.error("Error while creating payment:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });


// router.post('/maintenance', async (req, res) => {
    
//     const { issueDate, issueDescription, status, closedDate } = req.body;  

//     const agreementId = req.query.agreementId || req.body.agreementId;
//     const tenantId = req.query.tenantId || req.body.tenantId;

//     try {
       
//         if (!agreementId || !tenantId) {
//             return res.status(400).json({ message: "Agreement ID and Tenant ID are required" });
//         }

    
//         const agreementExists = await LeaseAgreementModel.findById(agreementId);
//         if (!agreementExists) {
//             return res.status(400).json({ message: "Agreement does not exist" });
//         }

//         const tenantExists = await TenantModel.findById(tenantId);
//         if (!tenantExists) {
//             return res.status(400).json({ message: "Tenant does not exist" });
//         }
//         const newMaintenance = new MaintenanceModel({
//             agreementId,
//             tenantId,
//             issueDate,
//             issueDescription,
//             status,
//             closedDate: status === 'resolved' ? closedDate : null 
//         });

//         await newMaintenance.save();

     
//         res.status(201).json({
//             message: 'Maintenance issue created successfully',
//             maintenance: newMaintenance
//         });
//     } catch (error) {
//         console.error('Error while creating maintenance issue:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });


module.exports = router;