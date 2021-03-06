const mongoose = require('mongoose'),

    AutoIncrement = require('mongoose-sequence')(mongoose);


Schema = mongoose.Schema;

//================================
// DiaryEntry Schema
//================================
const DiaryEntrySchema = new Schema({
    diaryEntryId: {
        type: Number
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    userId: {
        type: Number,
        references: 'user',
        referencesKey: 'id',
        allowNull: false,
        required: true
    },
    date: {
        type: Date
    }
});

DiaryEntrySchema.plugin(AutoIncrement, { inc_field: 'diaryEntryId' });

module.exports = mongoose.model('DiaryEntry', DiaryEntrySchema);