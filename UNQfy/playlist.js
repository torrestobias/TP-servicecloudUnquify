class PlayList{
    
    constructor(name, genresToInclude , maxDuration){
        this.name = name;
        this.genresToInclude = genresToInclude;
        this.maxDuration = maxDuration;
        this.tracks = [];
    }


    getName() {return this.name};

    getGenresToInclude() {return this.genresToInclude};

    duration() {return this.maxDuration};

    hasTrack(aTrack){
        return (this.tracks.some(tema => tema.getName().toLowerCase() == aTrack.getName().toLowerCase()))
    }

    addTracksToPlaylist(trackList){ //modificar para que la duracion sea de toda la playlist
        let list = trackList.filter(track => track.duration < this.maxDuration);
        this.tracks.push.apply(this.tracks,list);
    }

    removeTracks(trackList){
        let tracksId = trackList.map(track => track.getId());
        let list = trackList.filter(track => !tracksId.includes(track.getId()));
        this.tracks = list;
    }
}

module.exports = PlayList;