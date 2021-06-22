class PlayList {

    constructor(id, name, genresToInclude, maxDuration=5000) {
        this.id = id
        this.name = name;
        this.maxDuration = maxDuration;
        this.genresToInclude = genresToInclude;
        this.tracks = [];
        this.actualDuration = 0;
    }

    getName() { return this.name };

    getId() { return this.id };

    getGenresToInclude() { return this.genresToInclude };

    duration() { return this.actualDuration };

    hasTrack(aTrack) {
        //return (this.tracks.some(tema => tema.getName().toLowerCase() == aTrack.getName().toLowerCase()))
        return this.tracks.includes(aTrack)
    }

    addTracksToPlaylist(trackList) {
        for (let track of trackList) {
            this.addTrack(track)
        }
    }

    removeTracks(trackList) {
        let tracksId = trackList.map(track => track.getId());
        let list = trackList.filter(track => !tracksId.includes(track.getId()));
        this.tracks = list;
    }

    addTrack(track) {
        let duration = this.actualDuration + track.getDuration();
        if (duration <= this.maxDuration) {
            this.tracks.push(track);
            this.actualDuration += track.getDuration();
        }
    }
}

module.exports = PlayList;