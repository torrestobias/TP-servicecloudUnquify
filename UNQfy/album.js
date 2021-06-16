class Album {

    constructor(id, name, year, tracks = []) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.tracks = tracks;
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

    getTrackByName(name) {
        return this.tracks.find(track => track.getName() === name);
    };

    addNewTrack(track) {
        this.tracks.push(track);
    };

    getTrackByGenre(genre){
        let trackByGenre = this.tracks.filter(track => track.getGenres().includes(genre));
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
        this.tracks = this.tracks.filter(track => track.id !== id);
    };

    updateTrack() {
        //TODO
    }

    addNewTrack(track) {
        if (this.tracks.length < 1) {
            this.tracks.push(track);
            console.log("✓ Se crea el track " + track.name)
        }
        else {
            if (!this.tracks.some(t => t.name.toLowerCase() === track.name.toLowerCase())) {
                this.tracks.push(track);
                console.log("✓ Se crea el track " + track.name);
            }
            else { console.log("X El track " + tack.name + " ya está creado.") }
        }

    }
}

module.exports = Album;
