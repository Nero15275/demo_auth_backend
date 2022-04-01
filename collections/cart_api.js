const express = require('express');
const { verifyToken, verifyTokenAndAuthoriztion, verifyTokenAndAdmin } = require('./verifyToken');
const router = express.Router()
const userModel = require('../models/user_model');
const productModel = require('../models/product_model')
const cartModel = require('../models/cart_model')

//Add product
router.post(`/addcart`, verifyTokenAndAuthoriztion, async (req, res) => {

    const newCart = new cartModel(req.body)
    try {
        const saveCart = await newCart.save()
        res.status(200).json(saveCart)

    } catch (err) {
        res.status(400).json(err)
    }

})
//update

router.put(`/:id`, verifyTokenAndAuthoriztion, async (req, res) => {

    try {
        const updateCart = await cartModel.findByIdAndUpdate(req.params.id, {
            $set: req.body,

        }, { new: true }
        )
        res.status(200).json(updateCart)
    } catch (err) {
        res.status(500).json(err)
    }
})

//delete

router.delete(`/delete/:id`, verifyTokenAndAuthoriztion, async (req, res) => {
    try {
        await cartModel.findByIdAndDelete(req.params.id)
        res.status(200).json(`Psroduct  successfully deleted`)

    } catch (err) {
        res.status(500).json(err)
    }
})


router.get(`/find/:userid`, verifyTokenAndAuthoriztion, async (req, res) => {
    try {
        const dbResponse = await cartModel.findOne({ userid: req.params.userid })


        res.status(200).json(dbResponse)

    } catch (err) {
        res.status(500).json(err)
    }
})

//get all
router.get(`/viewall`, verifyTokenAndAdmin, async (req, res) => {
    try {
        const dbResponse = await cartModel.find()
        res.status(200).json(dbResponse)

    } catch (err) {
        res.status(400).json(err)
    }
})



module.exports = router