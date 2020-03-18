const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const passport = require('passport');
const User = require('../models/User');
//login page
router.get('/login', (req, res) => {
    res.render('login');
});
//register page
router.get('/register', async (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    // console.log(req.body);
    const { name, email, password, password2 } = req.body;
    let errors = [];
    if (!email || !name || !password || !password2) {
        errors.push({ msg: 'please fill in all the fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'password do not match' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'password must be greater than 6' });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'email already exists' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else {
                    const newuser = new User({
                        name,
                        email,
                        password
                    });
                    // console.log(newuser);
                    // res.send('hello');
                    //     //hash password
                    //     bcrypt.genSalt(10, (err, salt) => {
                    //         bcrypt.hash(newuser.password, salt, (err, hash) => {
                    //             if (err)
                    //                 throw err;
                    //             //set password to hash
                    //             newuser.password = hash;
                    //             newuser.save()
                    //                 .then(user => {
                    //                     res.redirect('/users/login');
                    //                 })
                    //                 .catch(err => console.log(err))
                    //         });
                    //     });
                    // }
                    // })
                    //easy way to hash a password
                    const hash = bcrypt.hashSync(newuser.password, 10);
                    // .then(hash => {
                    newuser.password = hash;
                    newuser.save()
                        .then(user => {
                            req.flash('success_msg', 'you are now register and log in!!');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }
            });
    }
});

router.post('/login', (req, res,next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})
module.exports = router;