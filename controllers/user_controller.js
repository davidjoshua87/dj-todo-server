const users      = require('../model/user');
const jwt        = require('jsonwebtoken');
var bcrypt       = require('bcryptjs');
const saltRounds = 10;

module.exports = {
	getUser(req, res) {
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
	updateUser(req, res) {
		let username = req.body.username;
		let new_password = req.body.new_password;
		let old_password = req.body.old_password;

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

						if (!bcrypt.compareSync(old_password, userData.password)) {
							res.send({
								message: 'Password is not the same!'
							})
						} else {
							let password = ''

							//If new password is empty then use the old password to update. Else change the password to the new one
							if (new_password == '') {
								password = old_password;
							} else {
								password = new_password
							}
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
											password: hash
										}
									}
								}])
								.then(function (response) {
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
		})

	}
}