"use strict"
const jwt = require('jsonwebtoken'),
    User = require('../models/user'),
    config = require('../config/main');

function generateToken(user) {
    return jwt.sign(user, config.secret, {
        expiresIn: 10080 // in seconds
    });
}

// Set user info from request

function setUserInfo(request) {
    return {
        _id: request._id,
        userId: request.userId,
        firstName: request.profile.firstName,
        lastName: request.profile.lastName,
        email: request.email,
        role: request.role,
        dateOfBirth: request.profile.dateOfBirth,
        illnesses: request.illnesses,
        gender: request.profile.gender
    };
}

//========================================
// Login Route
//========================================
exports.login = function(req, res, next) {

    let userInfo = setUserInfo(req.user);

    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
};


//========================================
// Registration Route
//========================================
exports.register = function(req, res, next) {
    // Check for registration errors
    const email = req.body.email;
    const role = req.body.role;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const dateOfBirth = req.body.dateOfBirth;
    const gender = req.body.gender;

    // Return error if no email provided
    if (!email) {
        return res.status(422).send({ error: 'You must enter an email address.' });
    }

    // Return error if full name not provided
    if (!firstName || !lastName) {
        return res.status(422).send({ error: 'You must enter your full name.' });
    }

    // Return error if no password provided
    if (!password) {
        return res.status(422).send({ error: 'You must enter a password.' });
    }

    User.findOne({ email: email }, function(err, existingUser) {
        if (err) { return next(err); }

        // If user is not unique, return error
        if (existingUser) {
            return res.status(422).send({ error: 'That email address is already in use.' });
        }

        // If email is unique and password was provided, create account
        let user = new User({
            email: email,
            password: password,
            profile: { firstName: firstName, lastName: lastName, dateOfBirth: dateOfBirth, gender: gender },
            role: role
        });

        user.save(function(err, user) {
            if (err) { return next(err); }

            // Subscribe member to Mailchimp list
            // mailchimp.subscribeToNewsletter(user.email);

            // Respond with JWT if user was created

            let userInfo = setUserInfo(user);

            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            });
        });
    });
};

exports.roleAuthorization = function(role) {
    return function(req, res, next) {
        const user = req.user;

        User.findById(user.id, function(err, foundUser) {
            if (err) {
                res.status(422).json({ error: 'No user was found.' });
                return next(err);
            }

            // If user is found, check role.
            if (foundUser.role == role) {
                return next();
            }

            res.status(401).json({ error: 'You are not authorized to view this content.' });
            return next('Unauthorized');
        })
    }
};

exports.getAll = function(req, res, next) {

    if (req.user.role == "Doctor"  || req.user.role == "Admin") {

        User.find().populate({
            path: 'illnesses',
            select: '-_id -users -__v'
        }).exec(function(err, result) {

            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            var array = [];

            result.forEach(function(element) {
                array.push(setUserInfo(element))
            });

            res.status(200).json({
                User: array
            });
        });
    } else {
        return res.status(422).send({ error: 'Unauthorized' });
    }
};

exports.getUser = function(req, res) {

    const id = req.params.id;

    if (req.user.role == "Doctor" || req.user.role == "Admin") {

        User.findOne({ userId: id }).populate({
            path: 'illnesses',
            select: '-_id -users -__v'
        }).exec(function(err, user) {

            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }
            if (user == null) {
                return res.status(422).send({ error: 'User not found.' });
            }
            // If User is not unique, return error
            res.status(200).json({
                User: setUserInfo(user)
            });
        });

    } else {
        return res.status(422).send({ error: 'Unauthorized' });
    }
};

exports.getUserByName = function(req, res) {

    const name = req.params.name;

    if (req.user.role == "Doctor"){

        User.findOne({ "profile.lastName": name }, function(err, user) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }
            if (user == null) {
                return res.status(422).send({ error: 'User not found.' });
            }
            // If User is not unique, return error
            res.status(200).json({
                User: setUserInfo(user)
            });
        });

    } else {
        return res.status(422).send({ error: 'Unauthorized' });
    }
};