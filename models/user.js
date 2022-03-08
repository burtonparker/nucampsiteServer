const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false // admin flag is false for new users
    }
});

module.exports = mongoose.model('User', userSchema); // notice we're doing this in one line now instead of two. User means collection will be named 'users'