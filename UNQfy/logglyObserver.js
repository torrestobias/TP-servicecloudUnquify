const Observer = require('./observer')
const rp = require('request-promise');

const LOGGLY_API_HOST = process.env["LOGGING_API_HOST"] || 'http://localhost:5002';

class LogglyObserver extends Observer {
    constructor(){
    super()
    }


    async notify(level, {item : elementoAgregado, function : funcion}){
        let mensaje = checkFunction(elementoAgregado , funcion);
        rp({
            method: 'POST',
            uri: LOGGLY_API_HOST+'/api/log',
            body: {
                message: mensaje ,
                level : level
            },
            json: true
        })
            .then((res) => {
                console.log(JSON.stringify(res));
            })
            .catch((err => {
                console.log(err);
                throw err
            }))
    }
}

module.exports = LogglyObserver;


/**
     * @brief Método que verifica la funcion que se le pasa por parámetro, y en base al mismo devuelve un mensaje personalizado acorde a la creación o borrado del elemento. 
     * **/
 function checkFunction(elementName, functionName){
    mensaje = '';
    switch (functionName) {
        case 'addArtist':
            mensaje = `Se ha agregado el artista ${elementName}.`
          break;
        case 'addTrack':
            mensaje = `Se ha agregado el track ${elementName}.`
          break;
        case 'addAlbum':
            mensaje = `Se ha agregado el album ${elementName}.`
          break;
        case 'deleteArtist':
            mensaje = `Se ha borrado el artista ${elementName}.`
          break;
          case 'deleteTrack':
            mensaje = `Se ha borrado el track ${elementName}.`
          break;
          case 'deleteAlbum':
            mensaje = `Se ha borrado el album ${elementName}.`
          break;
      }
      return mensaje;
}