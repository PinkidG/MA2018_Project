"use strict"
const User = require('../models/user');

function setUserInfo(request) {



    var userInfo = {
        userId: request.userId,
        firstName: request.profile.firstName,
        lastName: request.profile.lastName,
        email: request.email,
        role: request.role,
        dateOfBirth: request.profile.dateOfBirth,
        gender: request.profile.gender,
        illnesses: request.illnesses,
        treatments: request.treatments,
        entries: request.entries
    };

    if(userInfo.role !== "Patient"){
        userInfo["users"] = request.users
    }


    return userInfo
}



exports.addUserToUser = function(req, res) {

    
    const userId = req.params.userId;
    const myUser = req.user;

    if (myUser.role === "Patient"){
        return res.status(422).send({
            error: 'Request error!.',
            description: "Not allowed!"
        });
    }

    User.findOne({ userId: userId})
    .populate({path: 'users', select: '-_id -users -__v -password -entries'})
    .lean()
    .exec(function(err, user) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }
        if (user == null) {
            return res.status(422).send({ error: 'User  not found.' });
        }

        myUser.users.forEach(function(element){

            User.findOne({ id: element.id})
            .lean()
            .exec(function(err, result) {
                if (err == null){
                    if (user.userId === result.userId){
                        return res.status(422).send({ error: 'Already appended!' });
                    }

                }

                myUser.users.push(user);
                myUser.save(function(err, sendUser) {
                    if (err) {
                        return res.status(503).send({
                            error: 'Save error!',
                            description: err.message
                        });
                    }
        
        
                    let userInfo = setUserInfo(myUser);
                    res.status(201).json({
                    user: userInfo
                });
                    
        
                });

            });




        });



       
    });
};


//========================================
// Append Illness Route
//========================================
exports.addIllness = function(req, res) {

    const illnessid = req.params.illnessId;
    const userId = req.params.userId;

    Illness.findOne({ illnessId: id }, function(err, illness) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        if (illness == null) {
            return res.status(422).send({ error: 'Illness not found.' });
        }

        User.findOne({ userId: userId }, function(err, user) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            if (user == null) {
                return res.status(422).send({ error: 'User not found.' });
            }

        user.illnesses.push(illness);

        user.save(function(err, user) {
            if (err) {
                return res.status(503).send({
                    error: 'Save error!',
                    description: err.message
                });
            }

            let userInfo = setUserInfo(user);

            res.status(201).json({
                user: userInfo
            });
        });
        });
    });
};

exports.getAll = function(req, res) {

    if (req.user.role === "Doctor"  || req.user.role === "Admin") {

        User.find()
            .populate({path: 'illnesses', select: '-_id -users -__v'})
            .populate({path: 'treatments', select: '-_id'})
            .populate({path: 'entries', select: '-_id'})
            .populate({path: 'users', select: '-_id -users -__v -password -entries'})
            .lean()
            .exec(function(err, result) {

            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            let array = [];

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

    if (req.user.role === "Doctor" || req.user.role === "Admin") {

        User
            .findOne({ userId: id })
            .populate({path: 'illnesses', select: '-_id -users -__v'})
            .populate({path: 'treatments', select: '-_id -__v -illnesses'})
            .populate({path: 'users', select: '-_id -users -__v -password -createdAt -updatedAt'})
            .lean()
            .exec(function(err, user) {
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

    } else if (req.user.userId == id) {

        User.findOne({ userId: id }).populate({
            path: 'user',
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

    if (req.user.role === "Doctor" || req.user.role === "Admin") {

        User.findOne({ "profile.lastName": name }).populate({
            path: 'user',
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
        })

    }  else if (req.user.profile.lastName === name) {

        User.findOne({ "profile.lastName": name }).populate({
            path: 'user',
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