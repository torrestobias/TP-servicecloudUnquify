class User {
    constructor(id, nickname, name){
        this.id = id;
        this.nickname = nickname;
        this.name = name;
        this.listenedTrack = [];
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.nickname;
    }

    getListenedTrack(){
        return this.listenedTrack;
    }

    listenTrack(aTrack){
        this.listenedTrack.push(aTrack);
    }

    getListenedTrackNoRepeat(){
        const listenList = this.listenedTrack.filter((item, index) => {
            return this.listenedTrack.indexOf(item) === index
        })
    }
    
    getTimesHeard(aTrack){
        const timesHeard = this.listenedTrack.filter( track => track.id === aTrack.id );
        return timesHeard;
    }
}

module.exports = User;