const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if (whitelist.indexOf(req.header('Origin')) !== -1) { // indexOf returns -1 if the item we're looking for isn't found, we can use this to help our whitelist if/else
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors(); // returns a middleware function with a wildcard as a value, allows cors for all origins
exports.corsWithOptions = cors(corsOptionsDelegate); // checks to see if incoming requests belong to one of the whitelisted origins, if so returns with access control allow origin with the whitelisted origin as the value, and if not no cors value in the header at all.