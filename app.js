const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const mongoose = require('mongoose');
const db = require('./models/db');
//passport config
require('./config/passport')(passport);

const app = express();
///ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//static folders
app.use(express.static("views"));
app.use(express.static('public'));

// //bodyparser
// app.use(bodyparser.urlencoded({ extended: false }));
// app.use(bodyparser.json());
// body-parser middleware with express
app.use(express.urlencoded({ extended: false }));
//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//globals vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//routes    
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started on ${port}`);
})
