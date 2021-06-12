const express = require('express');
const rootAPI = express();
const {appArtist} = require('./artistRequest');

rootAPI.use('/api',appArtist);
rootAPI.listen(8000);