const express = require('express');
const router = express.Router();

const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const adminLayout = '../views/layouts/admin';
const signinLayout = '../views/layouts/signin';
const signupLayout = '../views/layouts/signup';








module.exports = router;
