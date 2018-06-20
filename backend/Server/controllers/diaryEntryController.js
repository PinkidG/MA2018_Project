"use strict";
const DiaryEntry = require('../models/diaryEntry'),
    User = require('../models/user');


function setDiaryEntryInfo(request) {
    return {
        id: request.diaryEntryId,
        title: request.title,
        message: request.message,
        userId: request.userId,
        status: request.status,
        date: request.date
    };
}

function setUserInfo(request) {
    return {
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
}

//========================================
// Add Entry
//========================================
exports.register = function(req, res, next) {
    const message = req.body.message;
    const status = req.body.status;
    const title = req.body.title;
    const user = req.user;
    const date = date.now();

    // Return error if no message or status is provided
    if (!message) {
        return res.status(422).send({ error: 'You must enter a message.' });
    } else if (!status) {
        return res.status(422).send({ error: 'You must enter a status.' });
    } else if (!title) {
        return res.status(422).send({ error: 'YOu must enter a title.' });
    }

    User.findOne({ userId: user.userId }).populate({path: 'diaryEntries', select: '-_id -__v'}).exec(function(err, topic) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        // If entry is unique, create entry
        let diaryEntry = new DiaryEntry({
            message: message,
            status: status,
            title: title,
            date: date,
            userId: user.userId
        });

        diaryEntry.save(function (err, diaryEntrySaved) {
            if (err) {
                return next(err);
            }
            user.diaryEntries.push(diaryEntrySaved);
            user.save(function (err, user) {
                if (err) {
                    return next(err);
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

    const id = req.user.userId;

    if (req.user.role === "Doctor" || req.user.role === "Admin") {

        DiaryEntry.find(function(err, result) {

            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            let array = [];

            result.forEach(function(element) {
                array.push(setDiaryEntryInfo(element))
            });

            res.status(200).json({
                diaryEntries: array
            });

        })

    } else {

        DiaryEntry.find({ userId: id }).populate({path: 'diaryEntries', select: '-_id -__v'}).exec(function(err, result) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            // If no entry exist
            if (!result) {
                return res.status(422).send({error: 'There is no entry in the diary'});
            }

            let array = [];

            result.forEach(function (element) {
                array.push(setDiaryEntryInfo(element))
            });

            res.status(200).json({
                diaryEntries: array
            });
        });
    }
};