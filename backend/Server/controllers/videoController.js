"use strict";
const fs = require('fs');
const fse = require('fs-extra');
const Video = require('../models/video');
function setVideoInfo(request) {
    return {
        id: request.videoId,
        title: request.title,
        user: request.user
    };
}

function setVideoInfoWithData(request) {
    return {
        id: request.videoId,
        title: request.title,
        video: request.video,
	user: request.user
    };
}

//========================================
// Add Video
//========================================
exports.register = function(req, res) {

console.log("Video Post requested")

    const user = req.user;

    if (req.user.role === "Doctor" || req.user.role === "Admin") {

        if(!req.file){
            return res.status(422).send({ error: 'You must provide a video' });
        } else if (!req.file.mimetype == ("video/mp4")){
            return res.status(422).send({ error: 'only mp4 allowed at the moment' });
        }

        let file = req.file,
            path = process.cwd() + "\\Server\\data\\";

	console.log(path)
	console.log(file.originalname)

        //console.log(file);
        // Logic for handling missing file, wrong mimetype, no buffer, etc.

        let buffer = file.buffer, //Note: buffer only populates if you set inMemory: true.
            fileName = file.originalname;

        // Return error if no title provided
        if (!fileName) {
            return res.status(422).send({ error: 'You must enter an title.' });
        }

        Video.findOne({ title: fileName }).populate({path: 'videos', select: '-_id -__v'}).exec(function(err, existingVideo) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            // If video is not unique, return error
            if (existingVideo) {
                return res.status(422).send({error: 'That video is already created.'});
            }


            let stream = fs.createWriteStream(path + fileName);
            stream.write(buffer);

            stream.on('error', function() {
                console.log('Could not write file to memory.');
                res.status(400).send({
                    message: 'Problem saving the file. Please try again.'
                });
            });
            stream.on('finish', function() {
                console.log('File saved successfully.');
                let data = {
                    message: 'File saved successfully.'
                };
                res.jsonp(data);
            });
            stream.end();

            // If video is unique, create video
            let video = new Video({
                title: fileName,
                user: user,
                video: buffer
            });

            video.save(function (err) {
                if (err) {
                    return next(err);
                }
                user.videos.push(video);
                user.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                });
            });
        });

        console.log('Stream ended.');
    } else {
        return res.status(422).send({ error: 'Unauthorized' });
    }
};

exports.getByTitle = function(req, res) {
    const title = req.params.title;
    const path = process.cwd() + '\\Server\\data\\'+ title + '.mp4';

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
        }
    });
};

exports.getById = function(req, res, next) {

    const id = req.params.id;

    Video.findOne({ videoId: id }).populate({
        path: 'videos',
        select: '-_id -__v -users -video'
    }).exec(function(err, video) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        if (video == null) {
            return res.status(422).send({ error: 'Video not found.' });
        }
        // If topic is not unique, return error
        res.status(200).json({
            video: setVideoInfo(video)
        });
    });
};

exports.getAll = function(req, res) {

    Video.find(function(err, result) {

        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        let array = [];

        result.forEach(function(element) {
		console.log(element);
            array.push(setVideoInfo(element))
        });

        res.status(200).json({
            video: array
        });

    })
};