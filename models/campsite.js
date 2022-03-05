const mongoose = require('mongoose');
// this is how we create a schema
const Schema = mongoose.Schema; // doing this so we can just refer to Schema

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true       
    }
}, {
    timestamps: true
});

const campsiteSchema = new Schema({ // first argument is required
    name: {
        type: String,
        required: true,
        unique: true // no two documents should have the same name field
    },
    description: {
        type: String, 
        required: true
    },
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {
    timestamps: true // automatically adds createdAt and updatedAt
}); // instantiates a new object named campsiteSchema

// now let's make a model!

const Campsite = mongoose.model('Campsite', campsiteSchema); // be sure to use Capitalized, SINGULAR versions here - in this case we're using Campsite (singular) for the collection campsites (plural)

module.exports = Campsite;