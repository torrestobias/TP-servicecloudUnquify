
class Observer {
    constructor() {
    }
    notify(subject, albumname) {
        const subjectName = subject.getName();
        const albumName = albumname;
        console.log(subjectName, albumName);
    }
}

class Notifyer extends Observer {
    constructor() {
        super()
    }
}
module.exports = Notifyer;