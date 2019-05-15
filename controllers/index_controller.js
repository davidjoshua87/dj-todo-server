const users      = require('../model/user');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const generator  = require('generate-serial-number');
const saltRounds = 10;


module.exports = {
    loginFB: function (req, res) {
        users.findOne({
                email: req.body.email
            })
            .then(function (userData) {

                if (!userData) {
                    let pass     = String(Math.random() * 999999);
                    let salt     = bcrypt.genSaltSync(saltRounds);
                    let hash     = bcrypt.hashSync(pass, salt);
                    let fullname = req.body.username;
                    let nickname = fullname.split(' ')[0];
                    users.create({
                            username: nickname,
                            email: req.body.email,
                            password: hash,
                            fbId: req.body.fbId
                        })
                        .then(response => {
                            let token = jwt.sign({
                                id: response._id
                            }, process.env.SECRET)
                            res.status(200).json({
                                message: 'Success login',
                                token: token,
                                username: response.username,
                                email: response.email
                            })
                        })
                        .catch(function (err) {
                            res.json({
                                message: 'Error while trying to login with FB',
                                err: err
                            })
                        })
                } else {
                    let token = jwt.sign({
                        id: userData._id
                    }, process.env.SECRET)
                    res.status(200).json({
                        message: 'Success login',
                        token: token,
                        username: userData.username,
                        email: userData.email
                    })
                }
            })
            .catch(function (err) {
                res.status(500).json({
                    message: 'Error while creating new user with FB',
                    err: err
                })
            })
    },

    loginUser: function (req, res) {
        users.findOne({
                username: req.body.username
            })
            .then(function (userData) {
                if (!userData) {
                    res.status(400).json({
                        message: 'incorrect username or password'
                    })
                } else {
                    bcrypt.compare(req.body.password, userData.password, function (err, result) {
                        if (!result) {
                            res.json({
                                message: 'incorrect username or password'
                            })
                        } else {
                            let token = jwt.sign({
                                id: userData._id
                            }, process.env.SECRET)
                            res.json({
                                message: 'Success login',
                                token: token,
                                username: userData.username,
                                email: userData.email
                            })
                        }
                    })
                }
            })
    },

    registerUser: function (req, res) {
        let password = req.body.password;
        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let letter = /[a-zA-Z]/;
        let number = /[0-9]/;
        if (password.length < 6) {
            res.status(400).json({
                message: 'Password too short!'
            })
        } else if (!letter.test(password) && number.test(password)) {
            res.status(400).json({
                message: 'Password must be alphanumeric'
            })
        } else if (!letter.test(req.body.username)) {
            res.status(400).json({
                message: 'Username must be alphabet'
            })
        } else if (!regexEmail.test(req.body.email)) {
            res.status(400).json({
                message: 'Email is wrong format'
            })
        } else {
            users.findOne({
                    email: req.body.email
                })
                .then(function (userData) {
                    if (userData != null) {
                        res.status(400).json({
                            message: "Email has been taken!",
                        })
                    } else {
                        let salt = bcrypt.genSaltSync(saltRounds);
                        let hash = bcrypt.hashSync(password, salt);
                        let fBId = generator.generate(17);
                        users
                            .create({
                                username: req.body.username,
                                email: req.body.email,
                                password: hash,
                                fbId: '.'+fBId
                            })
                            .then(function (result) {
                                res.status(200).json({
                                    message: "success register a new user",
                                    result: result
                                })
                            })
                    }
                })
                .catch(function (err) {
                    res.status(500).json({
                        message: err
                    })
                })
        }
    },
}