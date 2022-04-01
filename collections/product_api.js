const express = require('express');
const { verifyToken, verifyTokenAndAuthoriztion, verifyTokenAndAdmin } = require('./verifyToken');
const router = express.Router()
const userModel = require('../models/user_model');
const productModel = require('../models/product_model')

//Add product
router.post(`/addproduct`, verifyTokenAndAdmin, async (req, res) => {

    const newProduct = new productModel(req.body)
    try {
        const saveProduct = await newProduct.save()
        res.status(200).json(saveProduct)

    } catch (err) {
        res.status(400).json(err)
    }

})
//update

router.put(`/:id`, verifyTokenAndAdmin, async (req, res) => {

    try {
        const updateProduct = await productModel.findByIdAndUpdate(req.params.id, {
            $set: req.body,

        }, { new: true }
        )
        res.status(200).json(updateProduct)
    } catch (err) {
        res.status(500).json(err)
    }
})

//delete

router.delete(`/delete/:id`, verifyTokenAndAdmin, async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id)
        res.status(200).json(`Product  successfully deleted`)

    } catch (err) {
        res.status(500).json(err)
    }
})


router.get(`/find/:id`, async (req, res) => {
    try {
        const dbResponse = await productModel.findById(req.params.id)


        res.status(200).json(dbResponse)

    } catch (err) {
        res.status(500).json(err)
    }
})
//all user
router.get(`/viewall`, async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category
    try {
        let dbResponse
        if (qNew) {
            dbResponse = await productModel.find().sort({ createdAt: -1 }).limit(5)

        } else if (qCategory) {
            dbResponse = await productModel.find({
                categories: {
                    $in: [qCategory],
                }
            })
        } else {
            dbResponse = await productModel.find()
        }

        res.status(200).json(dbResponse)

    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router