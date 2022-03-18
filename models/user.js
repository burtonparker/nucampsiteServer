const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

// let's use passport instead

const userSchema = new Schema({
    facebookId: String,
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    }
});

// plugin passport, click!

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema); // notice we're doing this in one line now instead of two. User means collection will be named 'users'