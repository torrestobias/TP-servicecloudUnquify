const express = require('express');
const ValidateEntry = require("../validate-entry");
const validate = new ValidateEntry();
const tracks = express();
const root = '/tracks';

// GET : Obtiene el nombre y lyrics del track correspondiente al id del parametro.
tracks.get(root + '/:trackId' + '/lyrics', function (req, res, next) {
    const unqfy = validate.getUNQfy();
    try {
        var trackId = validate.parseIntEntry(req.params.trackId);
        var trackName = unqfy.getTrackById(trackId).name;
    } catch (e) {
        next(e);
    }
    unqfy.getLyrics(trackId)
        .then(lyrics => {
            res.status(200)
            res.json({ name: trackName, lyrics: lyrics });
        })
});

module.exports = { tracks };