require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override')
const blogRoutes = require('./routes/blog.js');
const userRoutes = require('./routes/user.js')
const homeRoute = require('./routes/home.js')
const cookieParser = require('cookie-parser');
const MongooseStore = require('connect-mongo')

const connectDB = require('./config/db.js');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 5000;

//%    Database connection
connectDB();

//todo   Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
     secret: 'keyboard cat',
     resave: false,
     saveUninitialized: true,
     store: MongooseStore.create({
          mongoUrl: process.env.MONGO_URI
     })
}))


//todo    Static files
app.use(express.static('public'));

//todo    Template engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


//todo%%%%%%%%    Routes    %%%%%%%%%%%%%
app.use('/user',userRoutes);
app.use('/blog', blogRoutes);
app.use('/',homeRoute);

app.listen(port, () => console.log(`app listening on port ${port}!`));