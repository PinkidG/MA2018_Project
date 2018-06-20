"use strict";
const Video = require('../models/video');
const fs = require('fs');
const fse = require('fs-extra');
const multer = require('multer');

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
    //const title = req.body.title;
    //const video = req.body.video;

    const path = process.cwd() + '/data';

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
                return res.status(422).send({ error: 'That title is already in use.' });
            }

            var wstream = fs.createWriteStream(req.body.video);
            wstream.write(req.body.video);
            wstream.end();

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

exports.registertest = function(req, res, next) {

    const path = process.cwd() + '/data';

            var wstream = fs.createWriteStream(req.body.video);
            wstream.write(req.body.video);
            wstream.end();
};

exports.getByTitle = function(req, res, next) {
    const title = req.params.title;
    const path = process.cwd() + '/data/'+ title + '*';

    fse.exists(path, function(exists) {
        if (exists) {
            const stat = fs.statSync(path);
            const fileSize = stat.size;
            const range = req.headers.range;

            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = (end - start) + 1;
                const file = fs.createReadStream(path, {start, end});
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
            return res.status(422).send({ error: 'Video not found.' });
        }});
};