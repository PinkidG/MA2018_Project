"use strict"
const Illness = require('../models/illness'),
    Treatment = require('../models/treatment');

function setIllnessInfo(request) {
    return {
        id: request.illnessId,
        name: request.name,
        description: request.description,
        treatments: request.treatments
    };
}

//========================================
// Add Illness
//========================================
exports.register = function(req, res, next) {
    const name = req.body.name;
    const description = req.body.description;

    if (req.user.role === "Doctor" || req.user.role === "Admin") {
        // Return error if no name provided
        if (!name) {
            return res.status(422).send({ error: 'You must enter an illness name.' });
        }
        // Return error if description not provided
        if (!description) {
            return res.status(422).send({ error: 'You must enter a description.' });
        }

        Illness.findOne({ name: name }, function(err, existingIllness) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

        // If illness is not unique, return error
        if (existingIllness) {
            return res.status(422).send({ error: 'That illness is already created.' });
        }

        // If illness is unique, create illness
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
    } else {
        return res.status(422).send({ error: 'Unauthorized' });
    }
};


exports.getAll = function(req, res, next) {

    Illness.find(function(err, result) {

        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        let array = [];

        result.forEach(function(element) {
            array.push(setIllnessInfo(element))
        });

        res.status(200).json({
            illness: array
        });

    })
};

exports.getById = function(req, res, next) {

    const id = req.params.id;

    Illness.findOne({ illnessId: id }).populate({
        path: 'treatments',
        select: '-_id -illnesses -__v'
    }).exec(function(err, illness) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        if (illness == null) {
            return res.status(422).send({ error: 'Illness not found.' });
        }
        // If illness is not unique, return error
        res.status(200).json({
            illness: setIllnessInfo(illness)
        });
    });
};

exports.addTreatment = function(req, res) {

    const id = req.params.treatmentId;
    const illid = req.params.id;

    Treatment.findOne({ treatmentId: id }, function(err, treatment) {
        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        if (treatment == null) {
            return res.status(422).send({ error: 'Treatment not found.' });
        }

        Illness.findOne({ illnessId: illid }, function(err, illness) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

            if (illness == null) {
                return res.status(422).send({ error: 'Illness not found.' });
            }

        illness.treatments.push(treatment);

        illness.save(function(err, illness) {
            if (err) {
                return res.status(503).send({
                    error: 'Save error!',
                    description: err.message
                });
            }

            let illnessInfo = setIllnessInfo(illness);

            res.status(201).json({
                illness: illnessInfo
            });
        });
        });
    });
};