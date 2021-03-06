//*********************************
// Video-Controller
// NewMed - Backend
// Copyright 2018 - DHBW (WWI15SEB)
//*********************************

"use strict";
const fs = require('fs');
const fse = require('fs-extra');
const Video = require('../models/video');
const User = require('../models/user');

function setVideoInfo(request) {
    return {
        id: request.videoId,
        title: request.title,
        userId: request.userId
    };
}

function setUserInfo(request) {

    var userInfo = {
        userId: request.userId,
        firstName: request.profile.firstName,
        lastName: request.profile.lastName,
        email: request.email,
        role: request.role,
    };

    return userInfo;
}

//========================================
// Add and upload new video
//========================================
exports.register = function (req, res) {

    const user = req.user;
    const userId = req.user.userId;

    if (req.user.role === "Doctor" || req.user.role === "Admin") {

        if (!req.file) {
            return res.status(422).send({
                error: 'You must provide a video'
            });
        } else if (!req.file.mimetype == ("video/mp4")) {
            return res.status(422).send({
                error: 'only mp4 allowed at the moment'
            });
        }

        let file = req.file,
            path = process.cwd() + "\\Server\\data\\";
        // Logic for handling missing file, wrong mimetype, no buffer, etc.

        let buffer = file.buffer, //Note: buffer only populates if you set inMemory: true.
            fileName = file.originalname;

        // Return error if no title provided
        if (!fileName) {
            return res.status(422).send({
                error: 'You must enter an title.'
            });
        }

        Video.findOne({
            title: fileName
        }).populate({
            path: 'videos',
            select: '-_id -__v'
        }).exec(function (err, existingVideo) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            // If video is not unique, return error
            if (existingVideo) {
                return res.status(422).send({
                    error: 'That video is already created.'
                });
            }


            let stream = fs.createWriteStream(path + fileName);
            stream.write(buffer);

            stream.on('error', function () {
                console.log('Could not write file to memory.');
                return res.status(400).send({
                    message: 'Problem saving the file. Please try again.'
                });
            });
            stream.on('finish', function () {});
            stream.end();

            // If video is unique, create video
            let video = new Video({
                title: fileName,
                userId: userId
            });

            video.save(function (err) {
                if (err) {

                    return res.status(400).send({
                        message: 'Video save error. Video Save.'
                    });
                }
                user.videos.push(video);
                user.save(function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: 'Video save error. User Save.'
                        });
                    }
                });
                return res.status(200).json({
                    video: setVideoInfo(video)
                });
            });
        });
        console.log('Stream ended.');
    } else {
        return res.status(422).send({
            error: 'Unauthorized'
        });
    }
};

//========================================
// Get video by title (without extension)
//========================================
exports.getByTitle = function (req, res) {
    const title = req.params.title;
    const path = process.cwd() + '\\Server\\data\\' + title + '.mp4';

    fse.exists(path, function (exists) {
        if (exists) {
            const stat = fs.statSync(path);
            const fileSize = stat.size;
            const range = req.headers.range;

            //Stream video to device
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = (end - start) + 1;
                const file = fs.createReadStream(path, {
                    start,
                    end
                });
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(206, head);
                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(200, head);
                fs.createReadStream(path).pipe(res)
            }
        } else {
            return res.status(422).send({
                error: 'Video not found.'
            });
        }
    });
};

//========================================
// Get video by ID (only information)
//========================================
exports.getById = function (req, res, next) {

    const id = req.params.id;

    Video.findOne({
        videoId: id
    }).populate({
        path: 'videos',
        select: '-_id -__v -video'
    }).exec(function (err, video) {
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
                userId: video.userId
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
                res.status(200).json({
                    video: setVideoInfo(video),
                    user: setUserInfo(user)
                });


            });


    });
};


//========================================
// Get list of all videos
//========================================
exports.getAll = function (req, res) {

    Video.find(function (err, result) {

        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        let array = [];

        result.forEach(function (element) {
            console.log(element);
            array.push(setVideoInfo(element))
        });

        res.status(200).json({
            video: array
        });

    })
};

//========================================
// Delete videos
//========================================
exports.deleteVideo = function (req, res) {

    const id = req.params.id;

    let myquery = {
        videoId: id
    };

    Video.deleteOne(myquery, function (err) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        let data = {
            message: 'Video deleted successfully'
        };
        res.json(data);
    });
};