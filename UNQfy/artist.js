class Artist {

    constructor(name, country, id) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.albums = [];
    }

    getName() {
        return this.name;
    }

    getAlbums() {
        return albums;
    }

    getAlbumById(id) {
        return this.albums.find(album => album.id === id);
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
}

module.exports = Artist;