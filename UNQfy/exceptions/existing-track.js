
class ExistingTrackException extends Error {
    constructor(track, album){
        super(`El track ingresado: ${track.name} ya existe en el album: ${album.name}`);
        this.name = 'ExistingTrackException';
    }
}

module.exports = ExistingTrackException;