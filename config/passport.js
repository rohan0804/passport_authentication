const Localstrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = (passport) => {
    passport.use(
        new Localstrategy({ usernameField: 'email' }, (email, password, done) => {
            //match user
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'this email is not register' });
                    }
                    //match password
                    bcrypt.compare(password, user.password, (err, match) => {
                        if (err)
                            throw err;
                        if (match) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, { message: 'password incorrect!' });
                        }
                    })
                })
                .catch(err => console.log(err))
        })
    );
    passport.serializeUser((user,done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    });
}