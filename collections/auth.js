const express = require('express');
const userModel = require('../models/user_model');
const CryptoJS = require(`crypto-js`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

//register new user
router.post(`/signup`, async (req, res) => {
    try {
        const { username, mobile, email, address, password } = req.body
        console.log(req.body)
        if (!username || !mobile || !email || !address || !password) {

            res.status(422).json(`Enter all fields properly`)
        } else {
            const enqcriptedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.key);
            req.body.password = enqcriptedPassword
            const userData = userModel(req.body)
            const saveUser = await userData.save()
            console.log(saveUser);
            res.status(201).json(saveUser)

        }

    } catch (error) {
        res.status(400).json('registartion failed' + error)
    }
})
//signin
router.post(`/signin`, async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(req.body)
        if (!email || !password) {

            res.status(422).json(`Enter all fields properly`)
        } else {
            const hashedPassword = CryptoJS.AES.decrypt(req.body.password, process.env.key);
            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
            const dbResponse = await userModel.findOne({ email, originalPassword })
            console.log('pass', hashedPassword)
            console.log(dbResponse)
            if (dbResponse) {
                const accessToken = jwt.sign({
                    id: dbResponse._id,
                    isAdmin: dbResponse.isAdmin,
                    isSeller: dbResponse.isSeller
                }, process.env.jwtkey, {
                    expiresIn: '30d'
                })
                const { password, ...others } = dbResponse._doc
                res.cookie("accessToken", accessToken, { expires: (new Date(Date.now() + 5184000000)) }, { httpOnly: true })
                res.status(200).json({ ...others, accessToken, originalPassword })
            } else {
                res.status(400).json(`invalid user`)
            }

        }

    } catch (error) {
        res.status(400).json('signin failed' + error)
    }
})
module.exports = router