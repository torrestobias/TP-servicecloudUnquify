class Album {

    constructor(id, name, year) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.tracks = [];
    };

    getName() {
        return this.name;
    };

    getId() {
        return this.id;
    };

    getTracks() {
        return this.tracks;
    }

    getTrackById(id) {
        return this.tracks.find(track => track.id === id);
    };

    addNewTrack(track) {
        this.tracks.push(track);
    };

    getTrackByGenre(genre){
        let trackByGenre = this.tracks.filter(track => track.genres.includes(genre));
        return trackByGenre;
    }

    getAllGenres(genres){
        let allGenres = [];
        /*for(var genre in genres){
            let pruebita = this.getTrackByGenre(genre);
            allGenres.push(pruebita);
        }*/
        allGenres.push(genres.map(genre => this.getTrackByGenre(genre)));
        return allGenres;
    }

    getDurationAlbum() {
        return this.tracks.reduce(function (trackduration, track) {
            return trackduration + track.getDuration()
        }, 0);
    };

    delTrack(id) {
        this.tracks = this.tracks.filter(track => this.tracks.id !== id);
    };

    updateTrack() {
        //TODO
    }
}

module.exports = Album;
