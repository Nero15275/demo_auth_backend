const mongoose = require('mongoose');
const userModel = require('./user_model');



const shippingSchema = new mongoose.Schema({

    userid: { userModel._id, 'user_model' }
})