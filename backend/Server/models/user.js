const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    AutoIncrement = require('mongoose-sequence')(mongoose);
var relationship = require("mongoose-relationship");


//================================
// User Schema
//================================
const UserSchema = new Schema({
    userId: Number,
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        firstName: { type: String },
        lastName: { type: String },
        gender: { type: String },
        dateOfBirth: { type: String }
    },
    role: {
        type: String,
        enum: ['Patient', 'Doctor', 'Admin'],
        required: true
    },
    illnesses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Illness'
    }],
    entries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entry'
    }],
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        childPath: "users"
    }],
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, {
    timestamps: true
});
UserSchema.plugin(AutoIncrement, { inc_field: 'userId' });

UserSchema.plugin(relationship, {
    relationshipPathName: 'users'
});

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function(next) {
    const user = this,
        SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { return cb(err); }

        cb(null, isMatch);
    });
};

//Testen mit mongoose-relationship

module.exports = mongoose.model('User', UserSchema);