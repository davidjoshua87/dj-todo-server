const todo = require('../model/todo');
const jwt  = require('jsonwebtoken');

module.exports = {
    addTodo: function (req, res) {
        const token = req.headers.token
        jwt.verify(token, process.env.SECRET, function (err, result) {
            if (err) {
                res.status(500).json({
                    message: err
                })
            } else {
                todo
                    .create({
                        user: result.id,
                        todo: req.body.todo,
                        status: 'Not Done'
                    })
                    .then(function (result) {
                        res.status(200).json({
                            message: "success added new task",
                            result: result
                        })
                    })
                    .catch(function (err) {
                        res.status(500).json({
                            message: err
                        })
                    })
            }
        });
    },
    
    deleteTodo: function (req, res) {
        const token = req.headers.token
        jwt.verify(token, process.env.SECRET, function (err, result) {
            if (err) {
                res.status(500).json({
                    message: err
                })
            } else {
                todo
                    .bulkWrite([{
                        deleteOne: {
                            filter: {
                                '_id': req.params.id,
                                'user': result.id
                            }
                        }
                    }])
                    .then(function (result) {
                        res.status(201).json({
                            message: "Success delete data!",
                            result: result
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

    finishedTodo: function (req, res) {
        const token = req.headers.token
        jwt.verify(token, process.env.SECRET, function (err, result) {
            if (err) {
                res.status(500).json({
                    message: err
                })
            } else {
                todo
                    .bulkWrite([{
                        updateOne: {
                            filter: {
                                '_id': req.params.id,
                                'user': result.id
                            },
                            update: {
                                status: 'Done',
                            }
                        }
                    }])
                    .then(function (result) {
                        res.status(201).json({
                            message: "You have successfully finished the task!",
                            result: result
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

    findByStatus: function (req, res) {
        const token = req.headers.token
        jwt.verify(token, process.env.SECRET, function (err, result) {
            if (err) {
                res.status(500).json({
                    message: err
                })
            } else {
                todo
                    .find({
                        'user': result.id,
                        'status': req.params.status
                    })
                    .populate('user')
                    .exec()
                    .then(function (todoData) {
                        res.status(200).json({
                            message: "success get all todo data",
                            list: todoData
                        })
                    })
                    .catch(function (err) {
                        res.status(500).json({
                            message: err
                        })
                    })
            }
        });
    },

    showTodo: function (req, res) {
        const token = req.headers.token
        jwt.verify(token, process.env.SECRET, function (err, result) {
            if (err) {
                res.status(500).json({
                    message: err
                })
            } else {
                todo
                    .find({
                        'user': result.id,
                    })
                    .populate('user')
                    .exec()
                    .then(function (todoData) {
                        res.status(200).json({
                            message: "success get all todo data",
                            list: todoData
                        })
                    })
                    .catch(function (err) {
                        res.status(500).json({
                            message: err
                        })
                    })
            }
        });
    },

    unFinishedTodo: function (req, res) {
        const token = req.headers.token
        jwt.verify(token, process.env.SECRET, function (err, result) {
            if (err) {
                res.status(500).json({
                    message: err
                })
            } else {
                todo
                    .bulkWrite([{
                        updateOne: {
                            filter: {
                                '_id': req.params.id,
                                'user': result.id
                            },
                            update: {
                                status: 'Not Done',
                            }
                        }
                    }])
                    .then(function (result) {
                        res.status(201).json({
                            message: "You have successfully unfinished the task!",
                            result: result
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

    updateTodo: function (req, res) {
        const token = req.headers.token
        jwt.verify(token, process.env.SECRET, function (err, result) {
            if (err) {
                res.status(500).json({
                    message: err
                })
            } else {
                todo
                    .bulkWrite([{
                        updateOne: {
                            filter: {
                                '_id': req.params.id,
                                'user': result.id
                            },
                            update: {
                                todo: req.body.todo,
                            }
                        }
                    }])
                    .then(function (result) {
                        res.status(201).json({
                            message: "success update data",
                            result: result
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
}