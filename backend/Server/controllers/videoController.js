"use strict";
const fs = require('fs');
const fse = require('fs-extra');

//========================================
// Add Video
//========================================
exports.register = function(req, res) {

    if (req.user.role === "Doctor" || req.user.role === "Admin") {

        if(!req.file){
            return res.status(422).send({ error: 'You must provide a video' });
        } else if (!req.file.mimetype == ("video/mp4")){
            return res.status(422).send({ error: 'only mp4 allowed at the moment' });
        }

        let file = req.file,
            path = process.cwd() + '/data/';

        console.log(file);
        // Logic for handling missing file, wrong mimetype, no buffer, etc.

        let buffer = file.buffer, //Note: buffer only populates if you set inMemory: true.
            fileName = file.originalname;
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
        console.log('Stream ended.');
    } else {
        return res.status(422).send({ error: 'Unauthorized' });
    }
};

exports.getByTitle = function(req, res) {
    const title = req.params.title;
    const path = process.cwd() + '/data/'+ title + '.mp4';

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