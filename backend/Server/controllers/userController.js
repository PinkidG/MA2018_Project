//*********************************
// User-Controller
// NewMed - Backend
// Copyright 2018 - DHBW (WWI15SEB)
//*********************************

"use strict";
const User = require('../models/user');
const Video = require('../models/video');

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
        entries: request.entries,
        videos: request.videos,
        diaryEntries: request.diaryEntries
    };

    if (userInfo.role !== "Patient") {
        userInfo["users"] = request.users
    }


    return userInfo;
}

//========================================
// Add User to another user
//========================================
exports.addUserToUser = function (req, res) {


    const userId = req.params.userId;
    const myUser = req.user;


    // Only doctors and admins can assign a user to themselves
    if (myUser.role === "Patient") {
        return res.status(422).send({
            error: 'Request error!.',
            description: "Not allowed!"
        });
    }

    User.findOne({
            userId: userId
        })
        .populate({
            path: 'users',
            select: '-_id -users -__v -password -entries'
        })
        .lean()
        .exec(function (err, user) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }
            if (user == null) {
                return res.status(422).send({
                    error: 'User not found.'
                });
            }


            var alreadyAdded = false;

            User.findOne({
                    _id: user._id
                })
                .populate({
                    path: 'users',
                    select: '-_id -users -__v -password -entries'
                })
                .lean()
                .exec(function (err, result) {
                    if (err == null) {
                        if (result != null) {
                            myUser.users.forEach(function (element) {

                                if (element.equals(result._id)) {
                                    alreadyAdded = true;
                                }
                            });
                            if (alreadyAdded) {
                                return res.status(422).send({
                                    error: 'Already appended!'
                                });
                            } else {
                                myUser.users.push(user);
                                myUser.save(function (err, sendUser) {
                                    if (err) {
                                        return res.status(503).send({
                                            error: 'Save error!',
                                            description: err.message
                                        });
                                    }
                                    let userInfo = setUserInfo(sendUser);
                                    return res.status(201).json({
                                        user: userInfo
                                    });
                                });
                            }
                        }

                    }
                });
        });
};


//========================================
// Add Illness to this user
//========================================
exports.addIllness = function (req, res) {

    const illnessId = req.params.illnessId;
    const userId = req.params.userId;

    Illness.findOne({
        illnessId: illnessId
    }, function (err, illness) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        if (illness == null) {
            return res.status(422).send({
                error: 'Illness not found.'
            });
        }

        User.findOne({
            userId: userId
        }, function (err, user) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            if (user == null) {
                return res.status(422).send({
                    error: 'User not found.'
                });
            }

            user.illnesses.push(illness);

            user.save(function (err, user) {
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

//========================================
// Add video to a user (favorites)
//========================================
exports.addVideo = function (req, res) {

    const videoId = req.params.videoId;
    const userId = req.params.userId;

    Video.findOne({
        videoId: videoId
    }, function (err, video) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        if (video == null) {
            return res.status(422).send({
                error: 'Video not found.'
            });
        }

        User.findOne({
            userId: userId
        }, function (err, user) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            if (user == null) {
                return res.status(422).send({
                    error: 'User not found.'
                });
            }

            user.videos.push(video);

            user.save(function (err, user) {
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

//========================================
// Get all registered users
//========================================
exports.getAll = function (req, res) {

    //Only allowed for doctors and admins
    if (req.user.role === "Doctor"  || req.user.role === "Admin") {

        User.find()
            .populate({
                path: 'illnesses',
                select: '-_id -users -__v'
            })
            .populate({
                path: 'treatments',
                select: '-_id'
            })
            .populate({
                path: 'entries',
                select: '-_id'
            })
            .populate({
                path: 'videos',
                select: '-_id -users -video -__v'
            })
            .populate({
                path: 'diaryEntries',
                select: '-_id -__v -userId'
            })
            .populate({
                path: 'users',
                select: '-_id -users -__v -password -entries'
            })
            .lean()
            .exec(function (err, result) {

                if (err) {
                    return res.status(403).send({
                        error: 'Request error!.',
                        description: err.message
                    });
                }

                let array = [];

                result.forEach(function (element) {
                    array.push(setUserInfo(element))
                });

                res.status(200).json({
                    User: array
                });
            });
    } else {
        return res.status(422).send({
            error: 'Unauthorized'
        });
    }
};

//========================================
// Get user by ID
//========================================
exports.getUser = function (req, res) {

    const id = req.params.id;

    if (req.user.role === "Doctor" || req.user.role === "Admin") {

        User
            .findOne({
                userId: id
            })
            .populate({
                path: 'illnesses',
                select: '-_id -users -__v'
            })
            .populate({
                path: 'treatments',
                select: '-_id -__v -illnesses'
            })
            .populate({
                path: 'diaryEntries',
                select: '-_id -__v -userId'
            })
            .populate({
                path: 'entries',
                select: '-_id'
            })
            .populate({
                path: 'videos',
                select: '-_id -users -video -__v'
            })
            .populate({
                path: 'users',
                select: '-_id -users -__v -password -createdAt -updatedAt'
            })
            .lean()
            .exec(function (err, user) {
                if (err) {
                    return res.status(403).send({
                        error: 'Request error!.',
                        description: err.message
                    });
                }
                if (user == null) {
                    return res.status(422).send({
                        error: 'User not found.'
                    });
                }
                // If User is not unique, return error
                res.status(200).json({
                    User: setUserInfo(user)
                });
            });

    } else if (req.user.userId == id) {

        User.findOne({
                userId: id
            })
            .populate({
                path: 'user',
                select: '-_id -users -__v'
            })
            .populate({
                path: 'illnesses',
                select: '-_id -users -__v'
            })
            .populate({
                path: 'treatments',
                select: '-_id -__v -illnesses'
            })
            .populate({
                path: 'entries',
                select: '-_id'
            })
            .populate({
                path: 'videos',
                select: '-_id -users -video -__v'
            })
            .populate({
                path: 'diaryEntries',
                select: '-_id -__v -userId'
            })
            .lean()
            .exec(function (err, user) {

                if (err) {
                    return res.status(403).send({
                        error: 'Request error!.',
                        description: err.message
                    });
                }
                if (user == null) {
                    return res.status(422).send({
                        error: 'User not found.'
                    });
                }
                // If User is not unique, return error
                res.status(200).json({
                    User: setUserInfo(user)
                });
            });
    } else {
        return res.status(422).send({
            error: 'Unauthorized'
        });
    }
};


//========================================
// Get user by name
//========================================
exports.getUserByName = function (req, res) {

    const name = req.params.name;

    if (req.user.role === "Doctor" || req.user.role === "Admin") {

        User.findOne({
            "profile.lastName": name
        }).populate({
            path: 'user',
            select: '-_id -users -__v'
        }).exec(function (err, user) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }
            if (user == null) {
                return res.status(422).send({
                    error: 'User not found.'
                });
            }
            // If User is not unique, return error
            res.status(200).json({
                User: setUserInfo(user)
            });
        })

    } else if (req.user.profile.lastName === name) {

        User.findOne({
            "profile.lastName": name
        }).populate({
            path: 'user',
            select: '-_id -users -__v'
        }).exec(function (err, user) {

            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }
            if (user == null) {
                return res.status(422).send({
                    error: 'User not found.'
                });
            }
            // If User is not unique, return error
            res.status(200).json({
                User: setUserInfo(user)
            });
        });
    } else {
        return res.status(422).send({
            error: 'Unauthorized'
        });
    }
};

//========================================
// Delete user
//========================================
exports.deleteUser = function (req, res) {

    const id = req.user.userId;

    let myquery = {
        userId: id
    };

    User.deleteOne(myquery, function (err) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        let data = {
            message: 'User deleted successfully'
        };
        res.json(data);
    });
};

//========================================
// Update user
//========================================
exports.updateUser = function (req, res) {

    let id = req.user.userId,
        firstName = req.body.firstName,
        lastName = req.body.lastName,
        email = req.body.email,
        dateOfBirth = req.body.dateOfBirth,
        gender = req.body.gender;

    let myquery = {
        userId: id
    };

    if (!firstName) {
        firstName = req.user.profile.firstName;
    }
    if (!lastName) {
        lastName = req.user.profile.lastName;
    }
    if (!email) {
        email = req.user.email;
    }
    if (!dateOfBirth) {
        dateOfBirth = req.user.profile.dateOfBirth;
    }
    if (!gender) {
        gender = req.user.gender;
    }
    let newValues = {
        $set: {
            profile: {
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dateOfBirth,
                gender: gender
            },
            email: email
        }
    };
    User.updateOne(myquery, newValues, function (err) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }
    });

    User.findOne({
        userId: id
    }).populate({
        path: 'user',
        select: '-_id -users -__v'
    }).exec(function (err, user) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        res.status(200).json({
            User: setUserInfo(user)
        });
    });
};