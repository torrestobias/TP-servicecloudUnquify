class ArtistDontExistError extends Error{
    constructor(){
        super("El artista no existe en el sistema")
        this.name = "ArtistDontExistError"
    }
}

module.exports = ArtistDontExistError;