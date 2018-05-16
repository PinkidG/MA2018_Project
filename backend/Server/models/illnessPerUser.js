const mongoose = require('mongoose'),
    Schema = mongoose.Schema

//================================
// IllnessPerUser Schema for n:m mapping between illness and user
//================================
const IllnessPerUserSchema = new Schema({
    id: {
        type: Number,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    illnessId: {
        type: Number,
        references: 'illness',
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

module.exports = mongoose.model('IllnessPerUser', IllnessPerUserSchema);