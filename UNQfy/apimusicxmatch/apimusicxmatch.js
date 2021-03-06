const rp = require('request-promise');
const dotenv = require('dotenv').config();

const API_KEY = '69ac4df780fafb37065b6f4c1d31b24e';//dotenv.parsed.API_KEY;
const BASE_URL = 'http://api.musixmatch.com/ws/1.1';

class Apimusicxmatch {

    setSearchOptions = (route, title) => {
        return {
            uri: BASE_URL + route,
            qs: {
                apikey: API_KEY,
                q_track: title,
                page_size: 1,
                page: 1,
                s_track_rating: 'desc'
            },
            json: true // Automatically parses the JSON string in the response
        }
    };

    setLyricOptions = (route, id) => {
        return {
            uri: BASE_URL + route,
            qs: {
                apikey: API_KEY,
                track_id: id,
            },
            json: true // Automatically parses the JSON string in the response
        }
    };

    getLyricByTitle(track, unqfy) {
        let title = track.getName()
        rp.get(
            this.setSearchOptions('/track.search', title)
        ).then((response) => {
            var header = response.message.header;
            var body = response.message.body;
            if (header.status_code !== 200) {
                throw new Error('status code != 200');
            }

            if (body.track_list.length === 0) {
                throw new Error('no existe ningun track con el nombre indicado');
            }

            Promise.resolve(body.track_list[0].track.track_id)
                .then((result) => {
                    //console.log(result);
                    rp.get(
                        this.setLyricOptions('/track.lyrics.get', result)
                    ).then((response) => {
                        var header = response.message.header;
                        var body = response.message.body;
                        if (header.status_code !== 200) {
                            throw new Error('status code != 200');
                        }
                        track.setLyrics(body.lyrics.lyrics_body);
                        console.log(track.getLyrics())
                        unqfy.save('data.json')
                    })
                })
        }).catch((error) => {
            console.log('algo salio mal', error);
        });
    }
}
module.exports = Apimusicxmatch;