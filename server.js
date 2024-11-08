
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./db.js');
const RentalLeaseAggrementRoute = require("./Routes/RentalLeaseAggrementRoute.jsx")
const app = express();
const PORT = 3006
connectDB();


app.use(cors())
app.use(bodyParser.json())

app.use('/get',(req,res)=>{
    res.send("connected to server")
})

app.use('/api', RentalLeaseAggrementRoute)

app.listen(PORT, ()=>{
    console.log("Port listening on ", PORT);
})
