const mongoose = require('mongoose'),

    AutoIncrement = require('mongoose-sequence')(mongoose);


Schema = mongoose.Schema;

 var relationship = require("mongoose-relationship");
//================================
// Treatment Schema
//================================
const TreatmentSchema = new Schema({
    treatmentId: {
        type: Number
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    illnesses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Illness',
        childPath: "treatments"
    }],
});

TreatmentSchema.plugin(relationship, {
    relationshipPathName: 'illnesses'
});

TreatmentSchema.plugin(AutoIncrement, { inc_field: 'treatmentId' });

module.exports = mongoose.model('Treatment', TreatmentSchema);