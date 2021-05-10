class Artist {

    constructor(name, country, id) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.albums = [];
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getAlbums() {
        return this.albums;
    }

    getAlbumById(id) {
        return this.albums.find(album => album.getId(id) == id);
    }

    addNewAlbum(album) {
        this.albums.push(album);
    }

    delAlbum(id) {
        this.albums = this.albums.filter(album => album.id !== id);
    }

    updateAlbum(){
        //TODO
    }

    getTrackArtist(){
      const tracks = this.albums.flatMap(album => album.tracks);
      return tracks;
    }
}

module.exports = Artist;