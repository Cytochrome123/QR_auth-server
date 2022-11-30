const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const User = require('../model/user');

module.exports = (passport) => {
    // passport.use(new LocalStrategy(User.authenticate()));
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
            }, 
            async (email, password, done) => {
            try {
                console.log(email +' **')
                let condition = { email };
                let projection = {
                    firstName:1,
                    lastName:1,
                    email:1,
                    password:1
                }
                let options = {lean :true}
                await queries.findOne(User,condition,projection, options)
                .then(user => {
                    return done(null, user)
                })
                .catch(err => {
                    return done(null, false)
                })
            } catch (err){
                throw err;
            }
        })
    );

    passport.serializeUser((user, done) => {
		done(null, toString(user._id));
	});

    passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
				secretOrKey: 'hhh',

			},
			async (jwtPayload, done) => {
                console.log(jwtPayload)
				let query = { email: mongoose.Types.ObjectId(jwtPayload.email) };

				let user = await queries.findOne(
					User,
					query,
				);

				if (user) {
                    // req.user = user
					return done(null, user);
				}
				return done(null);
			}
		)
	);
}