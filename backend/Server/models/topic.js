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
});

TopicSchema.plugin(AutoIncrement, { inc_field: 'topicId' });

module.exports = mongoose.model('Topic', TopicSchema);