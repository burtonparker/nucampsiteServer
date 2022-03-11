const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = user => {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600 /* aka 1 hour, ALWAYS expire your tokens or else they live for-e-ver */ })
};

const opts = {}; // empty object
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // please send this as an auth header and as a bearer token
opts.secretOrKey = config.secretKey;

// https://www.npmjs.com/package/passport-jwt
exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false); // we could code a new user creation prompt here, not now though
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', {session: false});