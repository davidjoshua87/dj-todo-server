const users      = require('../model/user');
const jwt        = require('jsonwebtoken');
var   bcrypt     = require('bcryptjs');
const saltRounds = 10;

module.exports = {
    changePassword: function (req, res) {
        let new_password = req.body.new_password;
        let token = req.headers.token;

        jwt.verify(token, process.env.SECRET, function (err, result) {
            if (err) {
                res.status(500).json({
                    message: err
                })
            } else {
                users.findOne({
                        '_id': result.id
                    })
                    .then(function (userData) {
                        if (bcrypt.compareSync(new_password, userData.password)) {
                            res.send({
                                message: 'Password is already taken!'
                            });
                        } else {
                            let salt = bcrypt.genSaltSync(saltRounds);
                            let hash = bcrypt.hashSync(new_password, salt);

                            users
                                .bulkWrite([{
                                    updateOne: {
                                        filter: {
                                            '_id': result.id
                                        },
                                        update: {
                                            password: hash
                                        }
                                    }
                                }])
                                .then(function () {
                                    res.send({
                                        message: 'Successfully changed your password'
                                    })
                                })
                                .catch(function (err) {
                                    res.status(500).json({
                                        message: err
                                    })
                                })
                        }
                    });
            }
        });
    },

    getUser: function (req, res) {
        let token = req.headers.token;

        jwt.verify(token, process.env.SECRET, function (err, result) {
            if (err) {
                res.status(500).json({
                    message: err
                })
            } else {
                users.findOne({
                        '_id': result.id
                    })
                    .then(function (userData) {
                        res.status(200).json({
                            data: userData
                        })
                    })
                    .catch(function (err) {
                        res.status(500).json({
                            message: err
                        })
                    })
            }
        })
    },

    updateUser: function (req, res) {
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;
        let token = req.headers.token;

        jwt.verify(token, process.env.SECRET, function (err, result) {
            if (err) {
                res.status(500).json({
                    message: err
                })
            } else {
                users.findOne({
                        '_id': result.id
                    })
                    .then(function (userData) {

                        if (!bcrypt.compareSync(password, userData.password)) {
                            res.send({
                                message: 'Password is not the same!'
                            });
                        } else {
                            let salt = bcrypt.genSaltSync(saltRounds);
                            let hash = bcrypt.hashSync(password, salt);
                            users
                                .bulkWrite([{
                                    updateOne: {
                                        filter: {
                                            '_id': result.id
                                        },
                                        update: {
                                            username: username,
                                            email: email,
                                            password: hash
                                        }
                                    }
                                }])
                                .then(function () {
                                    res.send({
                                        message: 'Successfully updated your profile'
                                    })
                                })
                                .catch(function (err) {
                                    res.status(500).json({
                                        message: err
                                    })
                                })
                        }
                    })
                    .catch(function (err) {
                        res.send({
                            message: err
                        })
                    })
            }
        });

    },
    
}