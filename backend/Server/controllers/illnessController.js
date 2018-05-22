"use strict"
const Illness = require('../models/illness'),
    config = require('../config/main');

function setIllnessInfo(request) {
    return {
        id: request.id,
        name: request.name,
        description: request.description
    };
}

//========================================
// Add Illness
//========================================
exports.register = function(req, res, next) {
    // Check for registration errors
    //const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;

    // Return error if no email provided
    if (!name) {
        return res.status(422).send({ error: 'You must enter an illness name.' });
    }

    // Return error if full name not provided
    if (!description) {
        return res.status(422).send({ error: 'You must enter a description.' });
    }

    Illness.findOne({ name: name }, function(err, existingIllness) {
        if (err) { return next(err); }

        // If illness is not unique, return error
        if (existingIllness) {
            return res.status(422).send({ error: 'That illness is already created.' });
        }

        // If email is unique and password was provided, create account
        let illness = new Illness({
            name: name,
            description: description
        });

        illness.save(function(err, illness) {
            if (err) { return next(err); }

            let illnessInfo = setIllnessInfo(illness);

            res.status(201).json({
                illness: illnessInfo
            });
        });
    });
};


exports.getAll = function(req, res, next) {

    Illness.find(function(err, result) {

        if (err) { return next(err); }

        res.status(200).json({
            illness: result
        });

    })
};