const mongoose = require('mongoose'),

    AutoIncrement = require('mongoose-sequence')(mongoose);


Schema = mongoose.Schema

var relationship = require("mongoose-relationship");
//================================
// Illness Schema
//================================
const IllnessSchema = new Schema({
    illnessId: {
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
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        childPath: "illnesses"
    }],
});

IllnessSchema.plugin(relationship, {
    relationshipPathName: 'users'
});

IllnessSchema.plugin(AutoIncrement, { inc_field: 'illnessId' })

module.exports = mongoose.model('Illness', IllnessSchema);