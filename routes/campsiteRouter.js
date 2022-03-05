const express = require('express');
const Campsite = require('../models/campsite');
const campsiteRouter = express.Router();

campsiteRouter.route('/') // single argument of a path, also note we converted these routes into a single long crazy chain method, check commit history for before and after in server.js
.get((req, res, next) => { // no need for statusCode or header because app.all already set those for us
    Campsite.find()
    .then(campsites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsites);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Campsite.create(req.body)
    .then(campsite => {
        console.log('Campsite Create ', campsite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})
.delete((req, res, next) => { // note: this is super dangerous and in the real world needs to be limited to only priviledged users
    Campsite.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

campsiteRouter.route('/:campsiteId')
.get((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})
.put((req, res, next) => {
    Campsite.findByIdAndUpdate(req.params.campsiteId, {
        $set: req.body
    }, { new: true })
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);        
    })
    .catch(err => (err));
})
.delete((req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);        
    })
    .catch(err => (err));
});

module.exports = campsiteRouter; // don't forget to export so we can use this elsewhere!