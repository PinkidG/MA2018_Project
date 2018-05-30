const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//================================
// TreatmentPerIllness Schema for n:m mapping between treatment and illness
//================================
const TreatmentPerIllnessSchema = new Schema({
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
    treatmentId: {
        type: Number,
        references: 'treatment',
        referencesKey: 'id',
        allowNull: false
    },
});

module.exports = mongoose.model('TreatmentPerIllness', TreatmentPerIllnessSchema);