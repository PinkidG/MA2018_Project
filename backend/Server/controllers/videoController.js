"use strict"
const Video = require('../models/video');

function setVideoInfo(request) {
    return {
        id: request.videoId,
        title: request.title,
        video: request.video
    };
}

//========================================
// Add Video
//========================================
exports.register = function(req, res, next) {
    const title = req.body.title;
    const video = req.body.video;

    if (req.user.role === "Doctor" || req.user.role === "Admin") {
        // Return error if no title provided
        if (!title) {
            return res.status(422).send({ error: 'You must enter a title.' });
        }
        // Return error if video is not provided
        if (!video) {
            return res.status(422).send({ error: 'You must attach a video.' });
        }

        Video.findOne({ title: title }, function(err, existingVideo) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            // If video is not unique, return error
            if (existingVideo) {
                return res.status(422).send({ error: 'That video is already in use.' });
            }

            // If video is unique, create video
            let video = new Video({
                title: title,
                video: video
            });

            video.save(function(err, video) {
                if (err) { return next(err); }
                let videoInfo = setVideoInfo(video);
                res.status(201).json({
                    video: videoInfo
                });
            });
        });
    } else {
        return res.status(422).send({ error: 'Unauthorized' });
    }
};


exports.getAll = function(req, res, next) {

    Video.find(function(err, result) {

        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        let array = [];

        result.forEach(function(element) {
            array.push(setVideoInfo(element))
        });

        res.status(200).json({
            video: array
        });

    })
};

exports.getById = function(req, res, next) {

    const id = req.params.id;

    Video.findOne({ videoId: id }).exec(function(err, video) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        if (video == null) {
            return res.status(422).send({ error: 'Video not found.' });
        }
        // If video is not unique, return error
        res.status(200).json({
            video: setVideoInfo(video)
        });
    });
};