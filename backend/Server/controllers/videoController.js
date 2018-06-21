"use strict";
const Video = require('../models/video');
const fs = require('fs');
const fse = require('fs-extra');
var multer = require('multer');
//const VideoController = require('./videoController');

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

    const path = process.cwd() + '/data/';

    var Storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, path);
        },
        filename: function(req, file, callback) {
            callback(null, file.originalname);
        }
    });

    var upload = multer({ storage: Storage }).array("videoUploader", 3);

    return {upload:upload};

   /* fs.writeFile(path + filename, req, function(error) {
        if (error) {
            return res.end("error:  " + error.message);
        } else {
            return res.end("Successful Write to " + path);
        }
    });*/


    /*var storage = multer.diskStorage({
        destination: function (request, file, callback){
            callback(null, path);
        },
        filename: function(request, file, callback){
            console.log(file);
            callback(null, file.originalname)
        }
    });

    var upload = multer({storage: storage}).single('videoFile');

    console.log(req.file);
    res.end('Your file Uploaded');
    console.log('Video Uploaded');*/

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

/*
exports.uploading = function(request, response, upload) {
    if(err) {
        console.log('Error Occured');
        return;
    }
    console.log(request.file);
    response.end('Your file Uploaded');
    console.log('Video Uploaded');
};*/
