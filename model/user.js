const mongoose   = require('mongoose');
const Schema     = mongoose.Schema
const userSchema = mongoose.Schema({
	fbId: String,
	email: String,
	username: String,
	password: String,
}, {
	timestamps: true
})

const user = mongoose.model('user', userSchema);

module.exports = user;