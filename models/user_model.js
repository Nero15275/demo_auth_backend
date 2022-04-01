const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true

    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },

    Products: {
        type: Array
    },
    wishlist: {
        type: Array
    }



}, { timestamps: true })
const userModel = mongoose.model(`user_model`, userSchema)
module.exports = userModel