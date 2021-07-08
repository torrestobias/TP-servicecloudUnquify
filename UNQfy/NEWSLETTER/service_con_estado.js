const express = require('express'); // Express web server framework
const bodyParser = require('body-parser');
const fs = require('fs');
const { errorHandlerF } = require('./errorHandler')
const ArtistNewsletter = require('./ArtistNewsletter')
const DATA_FILE = 'app_data/data.json';
const PORT = 5000;
const errors = require("./apiErrors");
const { get } = require('request');
const rp = require('request-promise');
const incompleteJSON = new errors.IncompleteJson();
const resourceNotFound = new errors.ResourceNotFound();
const relatedResourceNotFound = new errors.RelatedResourceNotFound();
const app = express();
app.use(bodyParser.json());


var temporaryMapFileServer = [];

const apiServer = "http://localhost:8000"/*"https://sietelotos.herokuapp.com"*/

async function getArtist(props) {
  const route = props.route
  return rp.get({
    uri: apiServer + route,
    json: true // Automatically parses the JSON string in the response
  })
    .then((res) => {
      if (res) {
        console.log("soliciturUNQFY" + JSON.stringify(res));
        return res;
      }
    })
    .catch((err => {
      console.log(err);
      if (err.status === 'Resource Not Found Error');
      throw relatedResourceNotFound;
    }))
}


//Subscribe un email a un artista. Si el email ya está suscrito no hace nada.  Este EP chequea usando la API de UNQfy que el artista exista.
app.post('/api/subscribe', async (req, res, next) => {
  try {
    subscribeValidateBody(req.body);
    const artist = await getArtist({ route: `/api/artists/${req.body.artistId}` });
    subscribeTo(artist.id, req.body.email);
    res.status(200);
    res.json({});
  } catch (e) {
    next(e)
  }
});

//Desubscribe un email. Si el email no esta suscrito no hace nada.  Este EP chequea usando la API de UNQfy que el artista exista.
app.post('/api/unsubscribe', async (req, res, next) => {
  try {
    subscribeValidateBody(req.body);
    const artist = await getArtist({ route: `/api/artists/${req.body.artistId}` });
    unsubscribeTo(artist.id, req.body.email);
  } catch (e) {
    next(e)
  }
  res.status(200);
  res.json({});
});

//Envía vía mail, un mensaje a todos los interesados suscritos a este artista. Se utilizará el subject y cuerpo de email pasados en el body del request.  Este EP chequea usando la API de UNQfy que el artista exista.
app.post('/api/notify', (req, res, next) => {
  try {
    notifyValidateBody(req.body);
    const artistId = req.body.artistId;
    const subject = req.body.subject;
    const message = req.body.message;
    const artist = getArtist({ route: `/api/artists/:${artistId}` });
    notifySubscribers(artist, subject, message);
  } catch (e) {
    next(e);
    /*TODO: 
Artista Inexistente.
Falta algún argumento en el json. (artistID, subject, message).
JSON inválido.
Falló el envío de la notificación
    ;*/
  }
  res.status(200);
  res.json({});
});

// Retorna el listado de suscriptores para el artista <artistID>.  Este EP chequea usando la API de UNQfy que el artista exista.
app.get('/api/subscriptions', async (req, res, next) => {
  let rta = ''
  try {
    artistValidateBody(req.query);
    const artistId = req.query.artistId;
    const artist = await getArtist({ route: `/api/artists/${artistId}` })
    console.log('EpSubscripitons: ' + artist.id)
    rta = getSubscribers(artist.id)
    res.status(200)
    res.json(rta)
  } catch (e) {
    console.log("entre al catch" + e)
    next(e);
  }
});

//Borra todas las suscripciones para un artista (útil cuando se borra un artista en UNQfy).  Este EP chequea usando la API de UNQfy que el artista exista.
app.delete('/api/subscriptions', async (req, res, next) => {
  try {
    artistValidateBody(req.body);
    const artist = await getArtist({ route: `/api/artists/${req.body.artistId}` });
    deleteSubscribers(artist.id);
    res.status(200);
    res.json({});
  } catch (e) {
    next(e); /*
    Artista Inexistente.
    Falta algún argumento en el json. (artistID).
    JSON inválido.
    */
  }
  /*     res.status(204);rariiiiisimoo
    res.json(); */
});

app.use(errorHandlerF);
app.all('*', function (req, res, next) {
  res.status(resourceNotFound.status)
  res.json({
    status: resourceNotFound.status,
    errorCode: resourceNotFound.errorCode
  })
});
/*
app.get('/api/ping', (req, res) => {
  console.log('ping arrived!');
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) { // El archivo no existe
      data = { count: 0 };
    } else {
      data = JSON.parse(data);
    }

    data.count = data.count + 1;
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
      console.log('Cantidad de pings: ' + data.count);
      res.json({message: 'pong'});
    });
  });
}).get('/api/echo', (req, res) => {
  var message = req.query.message || req.body.message || 'no message provided'
  console.log('echoing ' + message);
  res.json({message: message});
});

// manage 404 not found
app.use((req, res) => {
  res.status(404);
  res.json({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
});*/

function artistValidateBody(body) {
  if (body.artistId === undefined) {
    throw incompleteJSON
  }
}

function subscribeValidateBody(body) {
  if (body.artistId === undefined || body.email === undefined) {
    throw incompleteJSON
  }
}

function notifyValidateBody(body) {
  if (body.artistId === undefined || body.subject === undefined || body.message === undefined) {
    throw incompleteJSON
  }
}

function subscribeTo(id, email) {
  const registroArtistSubscribers = temporaryMapFileServer.find((artistSubscribers) => artistSubscribers.artistId === id);
  if (registroArtistSubscribers !== undefined) {
    temporaryMapFileServer.map((registro) => {
      if (registro.artistId === id) { registro.addSubscriber(email) }
    })
  } else {
    temporaryMapFileServer.push(new ArtistNewsletter(id, [email]))
  }
}

function unsubscribeTo(id, email) {
  const registroArtistSubscribers = temporaryMapFileServer.find((artistSubscribers) => artistSubscribers.artistId === id);
  if (registroArtistSubscribers !== undefined) {
    temporaryMapFileServer.map((registro) => {
      if (registro.artistId === id) {
        registro.deleteSubscriber(email)
      }
    })
  }
}

function notifySubscribers(artist, subject, message) {
  const subscribers = temporaryMapFileServer.get(`${artist.artistId}`);
  if (subscribers !== undefined) {
    subscribers.forEach(subscriberEmail => sendMessage(subject, message, subscriberEmail))
  }
}

function sendMessage(subject, message, subscriber) {
  //TODO
}

function getSubscribers(id) {
  const registroArtistSubscribers = temporaryMapFileServer.find((artistSubscribers) => artistSubscribers.artistId === id);
  if (registroArtistSubscribers !== undefined) {
    return ({
      "artistId": `${id}`,
      "subscriptors": registroArtistSubscribers.subscribers
    })
  } else {
    return ({
      "artistId": `${id}`,
      "subscriptors": []
    })
  }
}

function deleteSubscribers(id) {
  const registroArtistSubscribers = temporaryMapFileServer.find((artistSubscribers) => artistSubscribers.artistId === id);
  if (registroArtistSubscribers !== undefined) {
    temporaryMapFileServer.map((registro) => {
      if (registro.artistId === id) {
        registro.deleteSubscribers();
      }
    })
  }
}

app.listen(PORT, () => { console.log(`Listening on ${PORT}`); });
