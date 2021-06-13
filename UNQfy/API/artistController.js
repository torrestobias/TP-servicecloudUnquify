const fs = require('fs');
const { Router } = require('express');
const express = require('express');
const unqmod = require('../unqfy');
const {getUNQfy} = require("../validate-entry");
const app = express();
const router = Router();
router.use(express.json());


app.use('/api', router);

/*
* GET : devuelve el artista con id dado.
*/

router.route('/artists/:artistId').get((req,res) => {
    const unqfy = getUNQfy();
   
    const artistId = parseInt(req.params.artistId);
    const artist = unqfy.getArtistById(artistId);
    res.status(201);
    res.json(artist);
});

app.listen(8000, ()=>{
    console.log("El servidor está inicializado en el puerto 3000");
})