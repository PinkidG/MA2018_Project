//*********************************
// Topic-Controller
// NewMed - Backend
// Copyright 2018 - DHBW (WWI15SEB)
//*********************************

"use strict";
const Topic = require('../models/topic'),
    Entry = require('../models/entry'),
    Video = require('../models/video'),
    EntryController = require('./entryController');

function setTopicInfo(request) {
    return {
        id: request.topicId,
        title: request.title,
        userId: request.userId,
        entries: request.entries
    };
}

function setVideoInfo(request) {
    return {
        id: request.videoId,
        title: request.title,
        user: request.user
    };
}


//========================================
// Add new topic
//========================================
exports.register = function (req, res, next) {
    const title = req.body.title;
    const newTopic = true;
    const user = req.user;
    const id = user.userId;

    // Return error if no title provided
    if (!title) {
        return res.status(422).send({
            error: 'You must enter an title.'
        });
    }

    Topic.findOne({
        title: title
    }).populate({
        path: 'entries',
        select: '-_id -__v'
    }).exec(function (err, existingTopic) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        // If topic is not unique, return error
        if (existingTopic) {
            return res.status(422).send({
                error: 'That topic is already created.'
            });
        }

        // If topic is unique, create topic
        let topic = new Topic({
            title: title,
            userId: id
        });

        topic.save(function (err, topicSaved) {
            if (err) {
                return next(err);
            }
            user.topics.push(topic);
            user.save(function (err) {
                if (err) {
                    return next(err);
                }
                EntryController.registerWithTopic(req, res, newTopic, topicSaved);
            });
        });
    });
};


//========================================
// Get all available topics
//========================================
exports.getAll = function (req, res) {

    const id = req.user.userId;

    if (req.user.role === "Doctor" || req.user.role === "Admin") {

        Topic.find(function (err, result) {

            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            let array = [];

            result.forEach(function (element) {
                array.push(setTopicInfo(element))
            });

            res.status(200).json({
                topic: array
            });

        })

    } else {

        Topic.find({
            userId: id
        }).populate({
            path: 'entries',
            select: '-_id -__v'
        }).exec(function (err, existingTopic) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            // If no topic exist
            if (!existingTopic) {
                return res.status(422).send({
                    error: 'There is no topic'
                });
            }

            let array = [];

            existingTopic.forEach(function (element) {
                array.push(setTopicInfo(element))
            });

            res.status(200).json({
                topic: array
            });
        });
    }
};


//========================================
// Add topic by ID
//========================================
exports.getById = function (req, res) {

    const id = req.params.id;

    Topic.findOne({
        topicId: id
    }).populate({
        path: 'entries',
        select: '-_id -__v'
    }).exec(function (err, topic) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        if (topic == null) {
            return res.status(422).send({
                error: 'Topic not found.'
            });
        }
        // If topic is not unique, return error
        res.status(200).json({
            topic: setTopicInfo(topic)
        });
    });
};


//========================================
// Delete topic by ID
//========================================
exports.deleteTopic = function (req, res) {
    const id = req.params.id;
    Topic.findOne({
        topicId: id
    }).populate({
        path: 'entries',
        select: '-_id -__v'
    }).exec(function (err, topic) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }
        if (topic == null) {
            return res.status(422).send({
                error: 'Topic not found.'
            });
        }
        let myquery = {
            topicId: id
        };
        if (req.user.role === "Doctor" || req.user.role === "Admin") {
            Topic.deleteOne(myquery, function (err) {
                if (err) {
                    return res.status(403).send({
                        error: 'Request error!.',
                        description: err.message
                    });
                }
                Entry.remove(myquery, function (err, entry) {
                    if (err) {
                        return res.status(403).send({
                            error: 'Request error!.',
                            description: err.message
                        });
                    }
                    if (entry == null) {
                        return res.status(422).send({
                            error: 'Topic not found.'
                        });
                    }
                });

                let data = {
                    message: 'Topic deleted successfully'
                };
                res.jsonp(data);
            });
        } else if (req.user.userId === topic.userId) {
            Topic.deleteOne(myquery, function (err) {
                if (err) {
                    return res.status(403).send({
                        error: 'Request error!.',
                        description: err.message
                    });
                }
                Entry.remove(myquery, function (err, entry) {
                    if (err) {
                        return res.status(403).send({
                            error: 'Request error!.',
                            description: err.message
                        });
                    }
                    if (entry == null) {
                        return res.status(422).send({
                            error: 'Topic not found.'
                        });
                    }
                });
                let data = {
                    message: 'Topic deleted successfully'
                };
                res.jsonp(data);
            });
        } else {
            return res.status(422).send({
                error: 'Unauthorized'
            });
        }
    });
};


//========================================
// Search for topic
//========================================
exports.search = function (req, res) {
    const searchTerm = req.body.searchTerm;
    Topic.find({
        title: {
            $regex: new RegExp('.*' + searchTerm + '.*')
        }
    }).populate({
        path: 'topics',
        select: '-_id -__v'
    }).exec(function (err, existingTopic) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }
        // If no topic exist
        if (!existingTopic) {
            return res.status(422).send({
                error: 'There is no topic'
            });
        }
        let topicArray = [];
        existingTopic.forEach(function (element) {
            topicArray.push(setTopicInfo(element))
        });
        Video.find({
            title: {
                $regex: new RegExp('.*' + searchTerm + '.*')
            }
        }).populate({
            path: 'videos',
            select: '-video -_id -__v'
        }).exec(function (err, existingVideo) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }
            let videoArray = [];
            existingVideo.forEach(function (element) {
                videoArray.push(setVideoInfo(element))
            });
            res.status(200).json({
                topics: topicArray,
                videos: videoArray
            });
        });
    });
};