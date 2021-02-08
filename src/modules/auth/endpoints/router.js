const router = require("express").Router()
const jwt = require('jsonwebtoken');
const {
    getHash,
    compareHashes
} = require("../../../helpers/encrypt")
const User = require("../business/models/User")
const {
    validateUserAndPassword
} = require("../business/auth")

function authRouting(
    userRepository
) {

    router.post("/sign-up", function validateMessage(req, resp, next) {
        const userData = req.body

        if (!userData) {
            resp.status(400).json({
                error: 'There is no body in the request'
            })
        } else {
            if ((!userData.userName) || (!userData.passWord)) {
                resp.status(400).json({
                    error: 'Missing JSON properties'
                })
            } else {
                next()
            }
        }
    }, function validateUser(req, resp, next) {
        const userData = req.body

        if (!validateUserAndPassword(new User(userData.userName, userData.passWord))) {
            resp.status(400).json({
                error: 'Username and password must to have more than 4 characters'
            })
        } else {
            next()
        }
    }, async function verifyUserNameDuplication(req, resp, next) {

        const result = await userRepository.findUser(req.body.userName)
        if (result) {
            resp.status(400).json({
                message: 'Already exist the userName provided'
            })
        } else {
            next()
        }


    }, async function signUp(req, resp) {

        try {
            const encryptedPassword = await getHash(req.body.passWord)
            await userRepository.insertUser(new User(req.body.userName, encryptedPassword))

            resp.status(200).json({
                message: 'User added'
            })
        } catch (e) {
            console.log(e)
            resp.status(500).json({
                message: 'Server error, the user was not inserted, try again'
            })
        }
    })

    router.post("/sign-in", function verifyRequestFormat(req, resp, next) {
        const userData = req.body
        if ((!userData.userName) || (!userData.passWord)) {
            resp.status(400).json({
                error: 'Missing JSON properties'
            })
        } else {
            next()
        }
    }, async function verifyUserExistence(req, resp, next) {

            const result = await userRepository.findUser(req.body.userName)
            req.body.userId = result._id
            if (result) {
                req.body.dbPassword = result.passWord
                next()
            } else {
                resp.status(400).json({
                    message: 'The user does not exist'
                })
            }
        },
        async function comparePasswords(req, resp, next) {
                const resultComparision = await compareHashes(req.body.passWord, req.body.dbPassword)
                if (resultComparision) {
                    next()
                } else {
                    resp.status(400).json({
                        message: 'The password is incorrect'
                    })
                }
            },
            function sendAccessToken(req, resp) {

                function generateAccessToken(userName) {
                    return jwt.sign({
                        userName: userName,
                        userId: req.body.userId
                    }, process.env.JWT_SECRET, {
                        expiresIn: '24h'
                    });
                }

                resp.status(200).json({
                    accessToken: generateAccessToken(req.body.userName)
                })
            })

    return router
}

module.exports = authRouting