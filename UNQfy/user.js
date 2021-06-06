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
        const listenList = this.listenedTrack.filter((item, index) => {
            return this.listenedTrack.indexOf(item) === index
        })
    }
    
    getTimesHeard(aTrack){
        let counter = 0;
        for (i = 0 ; i < this.listenedTrack.length ; i++){
            if( aTrack.id === this.listenTrack[i].id){
                counter++;
            }
        }
        return counter;
    }

}