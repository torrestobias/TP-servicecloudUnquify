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
        return (this.tracks.some(track => track.name.toLoweCase() == aTrack.toLoweCase()))
    }

    addTracksToPlaylist(trackList){ 
        let list = [];
        for(var elem in trackList){
            if(elem.duration < this.maxDuration) {list.push(elem)};
        }
        this.tracks.concat(list)}
}

module.exports = PlayList;