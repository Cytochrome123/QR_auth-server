require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const QR = require("qrcode");
const cors = require('cors');
const session = require('express-session');

const User = require('./model/user');
const factory = require('./config/factory');

const app = express();

const passportLocalStrategy = require('./auth/passport');
passportLocalStrategy(passport);

mongoose.connect(process.env.MONGO_URL, (err, conn) => {
	if (err) {
		console.log('Mongo error ', err);
	} else {
		console.log('Mongoose Connection is Successful');
        app.listen(8000, () => console.log('QR on!!!'));
	}
});

app.use(express.json());
// app.use(cors({
//     origin: "https://qr-auth.vercel.app",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true, // allow session cookie from browser to pass through
//     optionsSuccessStatus: 200,
// }));
app.use(cors())

app.use(session({
    secret: 'hud',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/', async(req, res) => {
    // QR.toString('{name: Hud, age: 30}', (err, url) => {

    //     res.send({result: url})
    // })
    let userObj = {firstName: 'ghj'};

    // let private = 'hhh';
    // const token = jwt.sign(userObj, private);
    // await QR.toString(token)
    // .then((code) => console.log({result: code}))
    res.json({msg: 'hello'})
});

app.post('/api/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password} = req.body;
       const existed = await User.findOne({email})
       
       if(!existed) {
            let userObj = {firstName, lastName, email };

            let private = 'hhh';
            const token = jwt.sign(userObj, private);
            const code = await QR.toDataURL(token);
            userObj = {...req.body, password: factory.generateHashPassword(password), code};

            await new User(userObj).save()
           .then(user => {
                console.log(user);
                res.json({msg: 'Acc created'})
           })
       } else {
        res.json({msg: 'User exists!!!'});
       }
    } catch (err) {
        throw err;
    }
});

app.post('/api/login', (req, res, next) => {
    try {
        const { firstName, lastName, email } = req.body;
        passport.authenticate('local', (err, user, info) => {
            if (err) throw err;

            if (!user) {
                return res.status(400).json({ msg: info.msg });
            }

            req.logIn(user, (err) => {
                if (err) throw err;
                // let token = auth.token.createToken(user);
                let private = 'hhh';
                let userObj = {firstName: user.firstName, lastName, email, role: user.role}

                const token = jwt.sign(userObj, private);
                // res.status(200).json({token: token});

                res.status(200).json({token, role: user.role})
            });

            
        })(req,res,next)
    } catch (err) {
        throw err;
    }
})

app.get('/api/users', async (req, res) => {
    try {
        await User.find()
        .then(users => {
            res.json({users});
        })

    } catch (err) {
        throw err;
    }
})

app.get('/api/profile', passport.authenticate('jwt'), async (req, res) => {
    try {
        const { email } = req.user;
        await User.findOne({email})
        .then(user => res.status(200).json({user})).
        catch(e => res.status(400).json({msg: 'Not found'}))
    } catch (err) {
        throw err;
    }
})

app.patch('/api/souvenier1', async (req, res) => {
    try {
        console.log(req.params)
        const { email } = req.body;
        const { launchNo } = req.params
        console.log(email)
        await User.findOne({email})
        .then(async (user) => {
            // if(user.souvenier[launchNo - 1].no) {
            //     if(user.souvenier.collected) {
            //         res.status(200).json({msg: 'The user has already received one!'})
            //     }
            // } else {
            //     const update = {
            //         [souvenier.no]: launchNo,
            //         [souvenier.collected]: true
            //     }
            //     await User.findOneAndUpdate({email}, update)
            //     res.status(200).json({msg: 'Just marked as recieved'})
            // }

            if(user.souvenier1) {
                res.status(200).json({msg: 'Double Entry Alert! This user has been previously added'})
            } else {
                await User.findOneAndUpdate({email}, {souvenier1: true}, {new: true})
                res.status(200).json({msg: 'User Added Successfully'})
                
            }
        })
        .catch(e => console.log('Usernot found~'))
    } catch (err) {
        throw err;
    }
})

app.patch('/api/souvenier2', async (req, res) => {
    try {
        console.log(req.params)
        const { email } = req.body;
        const { launchNo } = req.params
        console.log(email)
        await User.findOne({email})
        .then(async (user) => {

            if(user.souvenier2) {
                res.status(200).json({msg: 'Double Entry Alert! This user has been previously added'})
            } else {
                await User.findOneAndUpdate({email}, {souvenier2: true}, {new: true})
                res.status(200).json({msg: 'User Added Successfully'})
                
            }
        })
        .catch(e => console.log('Usernot found~'))
    } catch (err) {
        throw err;
    }
})

app.patch('/api/souvenier3', async (req, res) => {
    try {
        console.log(req.params)
        const { email } = req.body;
        const { launchNo } = req.params
        console.log(email)
        await User.findOne({email})
        .then(async (user) => {

            if(user.souvenier3) {
                res.status(200).json({msg: 'Double Entry Alert! This user has been previously added'})
            } else {
                await User.findOneAndUpdate({email}, {souvenier3: true}, {new: true})
                res.status(200).json({msg: 'User Added Successfully'})
                
            }
        })
        .catch(e => console.log('Usernot found~'))
    } catch (err) {
        throw err;
    }
})

app.get('/api/collected1', async (req, res) => {
    try {
        await User.find({souvenier1: true})
        .then(collected => {
            res.status(200).json({data: collected})
        })
    } catch (err) {
        throw err;
    }
})

app.get('/api/collected2', async (req, res) => {
    try {
        await User.find({souvenier2: true})
        .then(collected => {
            res.status(200).json({data: collected})
        })
    } catch (err) {
        throw err;
    }
})

app.get('/api/collected3', async (req, res) => {
    try {
        await User.find({souvenier2: true})
        .then(collected => {
            res.status(200).json({data: collected})
        })
    } catch (err) {
        throw err;
    }
})