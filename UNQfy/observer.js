const rp = require('request-promise');
const UNQfyServer = 'http://localhost:5000';

class Observer {
    constructor() {
    }
    async notify(subject, albumname) {
        const subjectName = subject.getName();
        const albumName = albumname;
        console.log('notificacion observer' + subjectName, albumName);
        rp({
            method: 'POST',
            uri: UNQfyServer + '/api/notify',
            body: {
                artistId: subject.getId(),
                subject: `Nuevo Album para artista ${subjectName}`,
                message: `Se ha agregado el album ${albumName} al artista ${subjectName}`
            },
            json: true
        })
            .then((res) => {
                console.log("respuestaOK" + JSON.stringify(res));
            })
            .catch((err => {
                console.log(err);
                throw err
            }))
    }
}

class Notifyer extends Observer {
    constructor() {
        super()
    }
}
module.exports = Notifyer;