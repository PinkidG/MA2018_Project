"use strict"
const Topic = require('../models/topic'),
    Entry = require('../models/entry'),
    EntryController = require('./entryController');

function setTopicInfo(request) {
    return {
        id: request.topicId,
        title: request.title,
        userId: request.userId,
        entries: request.entries
    };
}

//========================================
// Add Topic
//========================================
exports.register = function(req, res, next) {
    const title = req.body.title;
    const newTopic = true;
    const user = req.user;
    const id = user.userId;

        // Return error if no title provided
        if (!title) {
            return res.status(422).send({ error: 'You must enter an title.' });
        }

        Topic.findOne({ title: title }).populate({path: 'entries', select: '-_id -__v'}).exec(function(err, existingTopic) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            // If topic is not unique, return error
            if (existingTopic) {
                return res.status(422).send({error: 'That topic is already created.'});
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


exports.getAll = function(req, res, next) {

    const id = req.user.userId;

    if (req.user.role === "Doctor" || req.user.role === "Admin") {

    Topic.find(function(err, result) {

        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        let array = [];

        result.forEach(function(element) {
            array.push(setTopicInfo(element))
        });

        res.status(200).json({
            topic: array
        });

    })

    } else {

        Topic.find({ userId: id }).populate({path: 'entries', select: '-_id -__v'}).exec(function(err, existingTopic) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            // If no topic exist
            if (!existingTopic) {
                return res.status(422).send({error: 'There is no topic'});
            }

            let array = [];

            existingTopic.forEach(function (element) {
                array.push(setTopicInfo(element))
            });

            res.status(200).json({
                topic: array
            });
        });
    };
};

exports.getById = function(req, res, next) {

    const id = req.params.id;

    Topic.findOne({ topicId: id }).populate({
        path: 'entries',
        select: '-_id -__v'
    }).exec(function(err, topic) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        if (topic == null) {
            return res.status(422).send({ error: 'Topic not found.' });
        }
        // If topic is not unique, return error
        res.status(200).json({
            topic: setTopicInfo(topic)
        });
    });
};

exports.addEntry = function(req, res) {

    const id = req.params.entryId;
    const topicId = req.params.id;

    Entry.findOne({ entryId: id }, function(err, entry) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        if (entry == null) {
            return res.status(422).send({ error: 'Entry not found.' });
        }

        Topic.findOne({ topicId: topicId }, function(err, topic) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            if (topic == null) {
                return res.status(422).send({ error: 'Topic not found.' });
            }

            topic.entries.push(entry);

            topic.save(function(err, topic) {
                if (err) {
                    return res.status(503).send({
                        error: 'Save error!',
                        description: err.message
                    });
                }

                let topicInfo = setTopicInfo(topic);

                res.status(201).json({
                    topic: topicInfo
                });
            });
        });
    });
};