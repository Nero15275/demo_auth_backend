const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

    userid: {
        type: String,
        required: true
    },
    products: [
        {
            productid: {
                type: String
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]


}, { timestamps: true })
const cartModel = mongoose.model(`cart_model`, cartSchema)
module.exports = cartModel