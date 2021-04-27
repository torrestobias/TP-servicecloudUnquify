class ExistArtistException extends Error {
    constructor(artist){
        super(`El artista ingresado: ${artist.name} ya existe en el sistema`);
        this.name = 'ExistArtistException';
    }
}

class ExistTrackException extends Error {
    constructor(track, album){
        super(`El track ingresado: ${track.name} ya existe en el album: ${album.name}`);
        this.name = 'ExistTrackException';
    }
}