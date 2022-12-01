const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true,},
	lastName: { type: String, required: true},
	email: { type: String, required: true },
	password: { type: String, default: null },
	code: { type: String, required: true },
	souvenier: { type: Boolean, default: false },
	role: { type: String, enum: ['admin', 'user'], default: 'user'}
})

// userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema);