class ArtistController {

    getArtistById(unqfy, req, res){
        let artist = unqfy.getArtistById(req.params.id)
        res.send(JSON.stringify(artist));
    }
}

class AlbumController {
    
}