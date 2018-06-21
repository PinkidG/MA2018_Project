const mongoose = require('mongoose'),

    AutoIncrement = require('mongoose-sequence')(mongoose);


Schema = mongoose.Schema;

//================================
// Topic Schema
//================================
const TopicSchema = new Schema({
    topicId: {
        type: Number
    },
    title: {
        type: String,
        unique: true,
        required: true
    },
    entries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entry'
    }],
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
});

TopicSchema.plugin(AutoIncrement, { inc_field: 'topicId' });

module.exports = mongoose.model('Topic', TopicSchema);