const mongoose = require('mongoose'),

    AutoIncrement = require('mongoose-sequence')(mongoose);


Schema = mongoose.Schema;

var relationship = require("mongoose-relationship");
//================================
// Video Schema
//================================
const VideoSchema = new Schema({
    videoId: {
        type: Number
    },
    title: {
        type: String,
        unique: true,
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        childPath: "videos"
    }],
    userId: {
        type: Number,
        references: 'user',
        referencesKey: 'id',
        allowNull: false,
        required: true
    },
});

VideoSchema.plugin(relationship, {
    relationshipPathName: 'users'
});

VideoSchema.plugin(AutoIncrement, { inc_field: 'videoId' });

module.exports = mongoose.model('Video', VideoSchema);