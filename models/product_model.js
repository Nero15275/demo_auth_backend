const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: `default`
    },
    productfeatures: {
        type: Array
    },



}, { timestamps: true })
const productModel = mongoose.model(`product_model`, productSchema)
module.exports = productModel