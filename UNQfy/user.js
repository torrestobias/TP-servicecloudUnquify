class User {
    constructor(id, nickname){
        this.id = id;
        this.nickname = nickname;
        this.listenedTrack = [];
    }

    getId(){
        return this.id;
    }

    getNickname(){
        return this.nickname;
    }

    getListenedTrack(){
        return this.listenedTrack;
    }

    listenTrack(aTrack){
        this.listenedTrack.push(aTrack);
    }

    getListenedTrackNoRepeat(){
        const listenList = this.listenedTrack
    }
    

}