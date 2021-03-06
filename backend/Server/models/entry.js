const mongoose = require('mongoose'),

    AutoIncrement = require('mongoose-sequence')(mongoose);


Schema = mongoose.Schema;

//================================
// Entry Schema
//================================
const EntrySchema = new Schema({
    entryId: {
        type: Number
    },
    message: {
        type: String,
        required: true
    },
    user: {
        userId: {
            type: Number,
            references: 'user',
            referencesKey: 'id',
            allowNull: false,
            required: true
        },
        profile: {
            firstName: { type: String },
            lastName: { type: String }
        },
    },
    topicId: {
        type: Number,
        references: 'topic',
        referencesKey: 'id',
        allowNull: false,
        required: true
    },
    date: {
        type: Date
    }
});

EntrySchema.plugin(AutoIncrement, { inc_field: 'entryId' });

module.exports = mongoose.model('Entry', EntrySchema);