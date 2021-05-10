
class ExistingPlaylistException extends Error {
    constructor(playlist){
        super(`La playlist: ${playlist.name} ingresada ya existe en el sistema`);
        this.name = `ExistingPlaylistException`;
    }
}

module.exports = ExistingPlaylistException;