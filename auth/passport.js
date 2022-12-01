const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const User = require('../model/user');
const factory = require('../config/factory');


const comparePassword = async (typedPassword, user, done) => {
    let isSame = factory.compareHashedPassword(typedPassword, user.password);

    // let isSame = true;

    if(isSame) {
        let update = { lastLogin: 100 };

        await queries.update(User, {_id: user._id}, update, {lean: true});
        return done(null, user);
    } else {
        return done(null, false, {msg: 'Incorrect password!!'});
    }
};


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
                // let condition = { email };
                // let projection = {
                //     firstName:1,
                //     lastName:1,
                //     email:1,
                //     password:1
                // }
                let options = {lean :true}
                await User.findOne({email})
                .then(user => {
                    comparePassword(password, user, done)
                    // return done(null, user)
                })
                .catch(err => {
                    return done(null, false, {msg: 'Err ooo'})
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
				let query = { email: jwtPayload.email };

				let user = await User.findOne(
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