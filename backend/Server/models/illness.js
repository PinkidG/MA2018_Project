const mongoose = require('mongoose'),
    Schema = mongoose.Schema

//================================
// Illness Schema
//================================
const IllnessSchema = new Schema({
    id: {
        type: Number,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
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
        ref: 'User'
    }],
});

module.exports = mongoose.model('Illness', IllnessSchema);