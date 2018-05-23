"use strict";
const Treatment = require('../models/treatment');


function setTreatmentInfo(request) {
    return {
        id: request.treatmentId,
        name: request.name,
        description: request.description
    };
}

//========================================
// Add Treatment
//========================================
exports.register = function(req, res, next) {
    // Check for registration errors
    //const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;

    if (req.user.role === "Doctor" || req.user.role === "Admin") {
    // Return error if no name provided
        if (!name) {
            return res.status(422).send({ error: 'You must enter an treatment name.' });
        }

    // Return error if description not provided
        if (!description) {
            return res.status(422).send({ error: 'You must enter a description.' });
        }

        Treatment.findOne({ name: name }, function(err, existingTreatment) {
            if (err) {
                return res.status(403).send({
                    error: 'Request error!.',
                    description: err.message
                });
            }

        // If treatment is not unique, return error
        if (existingTreatment) {
            return res.status(422).send({ error: 'That treatment is already created.' });
        }

        // If treatment is unique, create treatment
        let treatment = new Treatment({
            name: name,
            description: description
        });

        treatment.save(function(err, treatment) {
            if (err) { return next(err); }
            let treatmentInfo = setTreatmentInfo(treatment);
            res.status(201).json({
                treatment: treatmentInfo
            });
        });
        });
    } else {
        return res.status(422).send({ error: 'Unauthorized' });
    }
};


exports.getAll = function(req, res) {

    Treatment.find(function(err, result) {

        if (err) {
            return res.status(403).send({
                error: 'Request error!.',
                description: err.message
            });
        }

        let array = [];

        result.forEach(function(element) {
            array.push(setTreatmentInfo(element))
        });

        res.status(200).json({
            treatment: array
        });

    })
};

exports.getById = function(req, res) {

    const id = req.params.id;

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
        // If treatment is not unique, return error
        res.status(200).json({
            treatment: setTreatmentInfo(treatment)
        });
    });
};