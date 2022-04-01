const express = require('express');
const { verifyToken, verifyTokenAndAuthoriztion, verifyTokenAndAdmin } = require('./verifyToken');
const router = express.Router()
const userModel = require('../models/user_model');
const productModel = require('../models/product_model')
const cartModel = require('../models/cart_model')
const orderModel = require('../models/order_model')
//Add product
router.post(`/addorder`, verifyTokenAndAuthoriztion, async (req, res) => {

    const newOrder = new orderModel(req.body)
    try {
        const saveOrder = await newOrder.save()
        res.status(200).json(saveOrder)

    } catch (err) {
        res.status(400).json(err)
    }

})
//update

router.put(`/:id`, verifyTokenAndAdmin, async (req, res) => {

    try {
        const updateOrder = await orderModel.findByIdAndUpdate(req.params.id, {
            $set: req.body,

        }, { new: true }
        )
        res.status(200).json(updateOrder)
    } catch (err) {
        res.status(500).json(err)
    }
})

//delete

router.delete(`/delete/:id`, verifyTokenAndAdmin, async (req, res) => {
    try {
        await orderModel.findByIdAndDelete(req.params.id)
        res.status(200).json(`Psroduct  successfully deleted`)

    } catch (err) {
        res.status(500).json(err)
    }
})

//get user order
router.get(`/find/:userid`, verifyTokenAndAuthoriztion, async (req, res) => {
    try {
        const dbResponse = await orderModel.find({ userid: req.params.userid })


        res.status(200).json(dbResponse)

    } catch (err) {
        res.status(500).json(err)
    }
})

//get all
router.get(`/viewall`, verifyTokenAndAdmin, async (req, res) => {
    try {
        const dbResponse = await orderModel.find()
        res.status(200).json(dbResponse)

    } catch (err) {
        res.status(400).json(SyntaxError)
    }
})

//monthly stats
router.get(`/income`, verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastmonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new date(new Date().setMonth(lastmonth.getMonth() - 1))
    try {
        const dbResponse = await orderModel.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "createdAt" },
                    sales: "$amount"
                },

                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                },

            },



        ])
        res.status(200).json(dbResponse)

    } catch (err) {
        res.status(400).json(err)
    }
})
// // //all user
// // router.get(`/viewall`, async (req, res) => {
// //     const qNew = req.query.new
// //     const qCategory = req.quary.category
// //     try {
// //         let dbResponse
// //         if (qNew) {
// //             dbResponse = await productModel.find().sort({ createdAt: -1 }).limit(5)

// //         } else if (qCategory) {
// //             dbResponse = await productModel.find({
// //                 categories: {
// //                     $in: [qCategory],
// //                 }
// //             })
// //         } else {
// //             dbResponse = await productModel.find()
// //         }

// //         res.status(200).json(dbResponse)

// //     } catch (err) {
// //         res.status(500).json(err)
// //     }
// // })


module.exports = router