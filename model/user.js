const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true,},
	lastName: { type: String, required: true},
	email: { type: String, required: true },
	password: { type: String, default: null },
	code: { type: String, required: true },
	// souvenier: { 
	// 	type: [
	// 		{ no: String, collected: Boolean }
	// 	],
	// 	default: [ {no: '', collected: false } ]
	//  },
	souvenier1: {type: Boolean, default: false},
	souvenier2: {type: Boolean, default: false},
	category: { type: String, enum: ['Speaker', 'Participants', 'Team'], default: 'Participant' },
	role: { type: String, enum: ['admin', 'user'], default: 'user'}
})

// userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema);