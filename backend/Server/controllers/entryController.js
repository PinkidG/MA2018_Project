"use strict";
const Entry = require('../models/entry'),
    Topic = require('../models/topic');


function setEntryInfo(request) {
    return {
        id: request.entryId,
        message: request.message,
        userId: request.userId,
        topicId: request.topicId,
        date: request.date
    };
}

function setTopicInfo(request) {
    return {
        id: request.topicId,
        title: request.title,
        entries: request.entries,
        userId: request.userId
    };
}

//========================================
// Add Entry
//========================================
exports.register = function(req, res, next) {
    const message = req.body.message;
    const topId = req.body.topicId;
    const user = req.user;
    const date = date.now();

        // Return error if no message or topicId is provided
        if (!message) {
            return res.status(422).send({ error: 'You must enter a message.' });
        } else if (!topId) {
            return res.status(422).send({ error: 'You must enter a valid topicId.' });
        } else if (!user.userId) {
            return res.status(422).send({ error: 'You must enter a valid userId.' });
        }

        Topic.findOne({ topicId: topId }).populate({path: 'entries', select: '-_id -__v'}).exec(function(err, topic) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

                // Create entry
                let entry = new Entry({
                    message: message,
                    topicId: topic.topicId,
                    date: date,
                    userId: user.userId
                });

                entry.save(function (err, entry) {
                    if (err) {
                        return next(err);
                    }
                    topic.entries.push(entry);
                    topic.save(function (err, topicFinal) {
                        if (err) {
                            return next(err);
                        }
                        let topicInfo = setTopicInfo(topicFinal);
                        user.entries.push(entry);
                        user.save(function (err) {
                            if (err) {
                                return next(err);
                            }
                            res.status(201).json({
                                topic: topicInfo
                            });
                        });
                    });
                });
            });
};


exports.getAll = function(req, res) {

    Entry.find(function(err, result) {

        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        let array = [];

        result.forEach(function(element) {
            array.push(setEntryInfo(element))
        });

        res.status(200).json({
            entry: array
        });

    })
};

exports.getById = function(req, res) {

    const id = req.params.id;

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
        // If treatment is not unique, return error
        res.status(200).json({
            entry: setEntryInfo(entry)
        });
    });
};

exports.registerWithTopic = function(req, res, newTopic, topic) {
    const message = req.body.message;
    const entId = req.body.entryId;
    const topId = topic.topicId;
    const user = req.user;

    // Return error if no message or topicId is provided
    if (!message) {
        return res.status(422).send({ error: 'You must enter a message.' });
    } else if (!topId) {
        return res.status(422).send({ error: 'You must enter a valid topicId.' });
    } else if (!user.userId) {
        return res.status(422).send({ error: 'You must enter a valid userId.' });
    }


    Entry.findOne({ entryId: entId }, function(err, existingEntry) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        // If entry is not unique, return error
        if (existingEntry) {
            return res.status(422).send({ error: 'That entry is already created.' });
        }

        // If entry is unique, create entry
        let entry = new Entry({
            message: message,
            topicId: topId,
            userId: user.userId
        });

        entry.save(function(err, entry) {
            if (err) { return next(err); }
            topic.entries.push(entry);
            topic.save(function(err, topicFinal){
                if (err) {return next(err);}
                let topicInfo = setTopicInfo(topicFinal);
                user.entries.push(entry);
                user.save(function(err){
                    if (err) {return next(err);}
                    res.status(201).json({
                        topic: topicInfo
                    });
                });
            });
        });
    });
};