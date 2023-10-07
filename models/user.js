var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	unique_id: Number,
	email: String,
	country: String, 
	language: String,
	description: String,
	categories: Array,
	verified: Boolean,
	username: String,
	password: String,
	passwordConf: String,
}),

User = mongoose.model('User', userSchema);

module.exports = User;