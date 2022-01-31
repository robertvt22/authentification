// install dependencies 
// npm i express bcryptjs passport passport-local ejs express-ejs-layouts mongoose connect-flash express-session
// npm i nodemon --save-dev

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');



const app = express();
require('./config/passport')(passport);

const port = 3000;


//DB Config

// const db = require('./config/keys').MongoURI;

//connect to mongo
// mongoose.connect(db, { useNewUrlParser: true })
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.log(err));
// mongoose.connect("mongodb+srv://vlad1:dinamo@cluster0.070f5.mongodb.net/authDB3", {useNewUrlParser: true}, {useUnifiedTopology: true});

// var db = mongoose.connection;

// db.on('error',()=>console.log("Error in Connecting to Database"));
// db.once('open',()=>console.log("Connected to Database"))

const db = require('./config/keys').mongoURI;


// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


//EJS Middlewares
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Express sessiom middlewares
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global middlewares var
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

//Bodyparser
app.use(express.urlencoded({extended: false}));

//routers
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(port, console.info(`Listening on port ${port}`));
