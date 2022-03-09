const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

// let's use passport instead

const userSchema = new Schema({
    admin: {
        type: Boolean,
        default: false // admin flag is false for new users
    }
});

// plugin passport, click!

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema); // notice we're doing this in one line now instead of two. User means collection will be named 'users'