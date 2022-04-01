const express = require('express');
const { verifyToken, verifyTokenAndAuthoriztion, verifyTokenAndAdmin } = require('./verifyToken');
const router = express.Router()
const userModel = require('../models/user_model');


//update

router.put(`/:id`, verifyTokenAndAuthoriztion, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.key).toString();
    }
    try {
        const updateUser = await userModel.findByIdAndUpdate(req.params.id, {
            $set: req.body,

        }, { new: true }
        )
        res.status(200).json(updateUser)
    } catch (err) {
        res.status(500).json(err)
    }
})

//delete

router.delete(`/delete/:id`, verifyTokenAndAdmin, async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        res.status(200).json(`user successfully deleted`)

    } catch (err) {
        res.status(500).json(err)
    }
})


router.get(`/find/:id`, verifyTokenAndAdmin, async (req, res) => {
    try {
        const dbResponse = await userModel.findById(req.params.id)
        const { password, ...others } = dbResponse._doc

        res.status(200).json({ ...others })

    } catch (err) {
        res.status(500).json(err)
    }
})
//all user
router.get(`/viewall`, verifyTokenAndAdmin, async (req, res) => {
    try {
        const dbResponse = await userModel.find()


        res.status(200).json(dbResponse)

    } catch (err) {
        res.status(500).json(err)
    }
})
//user stats
router.get(`/userstats`, verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))     //get full year quary

    try {
        const data = await userModel.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },      // view as month created user account

                },
            },
            {
                $group: {
                    _id: "$month",       //month number
                    total: { $sum: 1 },   //total user crated in a month
                },
            }
        ])
        res.status(200).json(data)

    } catch (err) {

        res.status(500).json(err)
    }



})


module.exports = router