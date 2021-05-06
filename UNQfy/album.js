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

    getTrackById(id) {
        return this.tracks.find(track => track.id === id);
    };

    addNewTrack(track) {
        this.tracks.push(track);
    };

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
