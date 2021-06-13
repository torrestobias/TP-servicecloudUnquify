const express = require('express');
const rootAPI = express();
const {appArtist} = require('./artistController');
const {appAlbum} = require('./albumsController');

rootAPI.use('/api',appAlbum);
rootAPI.listen(8000, ()=>{
    console.log("El servidor está inicializado en el puerto 3000");
})