const { Router } = require('express');
const express = require('express');
const ValidateEntry = require("../validate-entry");
const app = express();
const router = Router();
router.use(express.json());
const errors = require("./apiErrors");
const BadRequest = errors.BadRequest
const badRequest = new errors.BadRequest();

const validate = new ValidateEntry();

/*
* GET : devuelve el artista con id dado.
* Faltan los errores y Excepcion si no encuentra al artista
*/



router.route('/artists/:artistId').get((req,res) => {
    try{
        
        const unqfy = validate.getUNQfy();
        const artistId = parseInt(req.params.artistId);
        const artist = unqfy.getArtistById(artistId);
        res.status(200);
        res.json(artist);
    }catch(e){

    }
    
});

/*
* POST : agrega un artista con un nombre y un pais.
* Faltan los errores y Excepcion si no encuentra al artista
*/

router.route('/artists').post((req,res) =>{
    
    try{

        const unqfy = validate.getUNQfy();
        validateBody(req.body);

        let name = req.body.name;
        let country = req.body.country;
        unqfy.addArtist({'name' : name, 'country' : country});
    
        let artist = unqfy.getArtistByName(name);
        res.status(201);
        res.send(JSON.stringify(artist));

    }catch(e){
        if(e instanceof BadRequest){
            res.status(badRequest.status)
            res.json({
                status : badRequest.status,
                errorCode : badRequest.errorCode
            })
        }
    }

})

/*
* PATH : actualiza un artista con un nombre y un pais.
* Faltan los errores y Excepcion si no encuentra al artista
*/

router.route('/artists/:artistId').patch((req,res) => {
    const unqfy = validate.getUNQfy();

    let artistId = parseInt(req.params.artistId);
    let name = req.body.name;
    let country = req.body.country;
    let artist = unqfy.getArtistById(artistId);

    unqfy.updateArtistWithNewData(artist,name,country);
    let updatedArtist = unqfy.getArtistById(artistId);
    res.status(200);
    res.send(JSON.stringify(updatedArtist));

});

/*
* DELETE : borrar un artista mediante un id.
* Faltan los errores y Excepcion si no encuentra al artista
*/

router.route('/artists/:artistId').delete((req,res)=>{
    const unqfy = validate.getUNQfy();

    let artistId = parseInt(req.params.artistId);
    let artist = unqfy.getArtistById(artistId);
    unqfy.deleteArtist({'artistName': artist.name});
    res.status(204);
    res.json( { status : 204,
        response : "la frase que quieras"});
})

/*
* SEARCH : devuelve un artista.
* Faltan los errores y Excepcion si no encuentra al artista
*/

router.route('/artists').get((req,res) =>{
    const unqfy = validate.getUNQfy();
        
        let artistName = req.query.name
    
        let artist = unqfy.searchArtistByName(artistName);
        res.status(200);
        res.json(artist);

})

function validateBody(body){
    if(!(body.name && body.country)){
        throw badRequest
    }
}


app.use('/api', router);

app.listen(8000, ()=>{
    console.log("El servidor está inicializado en el puerto 8000");
})

