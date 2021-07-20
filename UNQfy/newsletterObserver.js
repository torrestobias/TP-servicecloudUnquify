const Observer = require('./observer')
const rp = require('request-promise');

const NEWSLETTER_API_HOST = process.env["NEWSLETTER_API_HOST"] || 'http://localhost:5001';

class NewsletterObserver extends Observer {
    constructor() {
        super()
    }
    async notify(subject, albumname) {
        const subjectName = subject.getName();
        const albumName = albumname;
        console.log('notificacion observer' + subjectName, albumName);
        rp({
            method: 'POST',
            uri: NEWSLETTER_API_HOST + '/api/notify',
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

module.exports = NewsletterObserver;