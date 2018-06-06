const mongoose = require('mongoose'),
    Schema = mongoose.Schema

//================================
// VideoPerUser Schema for n:m mapping between video and user
//================================
const VideoPerUserSchema = new Schema({
    id: {
        type: Number,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    videoId: {
        type: Number,
        references: 'video',
        referencesKey: 'id',
        allowNull: false
    },
    userId: {
        type: Number,
        references: 'user',
        referencesKey: 'id',
        allowNull: false
    },
});

module.exports = mongoose.model('VideoPerUser', VideoPerUserSchema);