const Subject = require('./subject')

class Artist extends Subject {

    constructor(name, country, id) {
        super();
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
        return this.albums.find(album => album.getId() == id);
    }

    getAlbumByName(name) {
        return this.albums.find(album => album.getName() == name);
    }

    async addNewAlbum(album) {
        if (this.albums.length < 1 ||
            !this.albums.some(alb => alb.name.toLowerCase() === album.name.toLowerCase())) {
            this.albums.push(album);
            await super.notify(this, album.name);
        }
        else { console.log("X El album " + album.name + " ya está creado.") }
    }

    delAlbum(id) {
        this.albums = this.albums.filter(album => album.id !== id);
    }

    delAlbumByName(name) {
        this.albums = this.albums.filter(album => album.getName() !== name);
    }

    updateAlbum() {
        //TODO
    }

    updateArtist(name, country) {
        this.name = name;
        this.country = country;
    }

    getTrackArtist() {
        const tracks = this.albums.flatMap(album => album.tracks);
        return tracks;
    }

    thisAlbumIsCreated(album) {
        let rta = (this.albums.some(alb => alb.name === album.name))
        return rta;
    }
}

module.exports = Artist;