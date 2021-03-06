const express = require('express'); // Express web server framework
const bodyParser = require('body-parser');
const { errorHandlerF } = require('./errorHandler')
const ArtistNewsletter = require('./ArtistNewsletter')
const fs = require('fs');
const DATA_FILE = 'app_data/data.json';
const PORT = 5001;
const errors = require("./apiErrors");
const { get } = require('request');
const rp = require('request-promise');
const incompleteJSON = new errors.IncompleteJson();
const resourceNotFound = new errors.ResourceNotFound();
const relatedResourceNotFound = new errors.RelatedResourceNotFound();
const app = express();
app.use(bodyParser.json());
const NotificationSender = require('./gmail-tools/send-mail-example/sendMail')

const UNQFY_API_HOST = process.env["UNQFY_API_HOST"] || 'http://localhost:5000';
const LOGGING_API_HOST = process.env["LOGGING_API_HOST"] || 'http://localhost:5002';
const MONITOR_API_HOST = process.env["MONITOR_API_HOST"] || 'http://localhost:5003';

async function getArtist(props) {
  const route = props.route
  return rp.get({
    uri: UNQFY_API_HOST + route,
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
    await subscribeTo(artist.id, req.body.email);
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
    //si no es necesario manejar artista inexistente se puede obviar la linea de arriba
    await unsubscribeTo(artist.id, req.body.email);
  } catch (e) {
    next(e)
  }
  res.status(200);
  res.json({});
});

//Envía vía mail, un mensaje a todos los interesados suscritos a este artista. Se utilizará el subject y cuerpo de email pasados en el body del request.  Este EP chequea usando la API de UNQfy que el artista exista.
app.post('/api/notify', async (req, res, next) => {
  try {
    notifyValidateBody(req.body);
    const artist = await getArtist({ route: `/api/artists/${req.body.artistId}` });
    await notifySubscribers(artist.id, req.body.subject, req.body.message);
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
    rta = await subscribersArtistJsonResponse(artist.id)
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
    await deleteSubscribers(artist.id);
    res.status(200);
    res.json({});
  } catch (e) {
    next(e); /*
    Artista Inexistente.
    Falta algún argumento en el json. (artistID).
    JSON inválido.
    */
  }
});

app.get('/ping', (req, res) => {
  console.log('ping arrived!');
  res.json({ message: "pong" });
});

app.use(errorHandlerF);
app.all('*', function (req, res, next) {
  res.status(resourceNotFound.status)
  res.json({
    status: resourceNotFound.status,
    errorCode: resourceNotFound.errorCode
  })
});

function readData() {
  console.log('accesing fs!');
  try {
    return fs.readFileSync(DATA_FILE, { encoding: 'utf-8' });
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('enError' + err.code)
      writeData({ "fs": [] })
      return fs.readFileSync(DATA_FILE, { encoding: 'utf-8' });
    }
  }
}

function writeData(data) {
  console.log(data);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
    console.log('saving onto fs!');
  });
}

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

async function subscribeTo(id, email) {
  let temporaryFs = JSON.parse(readData()).fs
  console.log(temporaryFs)
  const registroArtistSubscribers = temporaryFs.find((artistSubscribers) => artistSubscribers.artistId === id);
  if (registroArtistSubscribers !== undefined) {
    temporaryFs.map((registro) => {
      if (registro.artistId === id) { new ArtistNewsletter(id, registro.subscribers).addSubscriber(email) }
    })
  } else {
    temporaryFs.push(new ArtistNewsletter(id, [email]))
  }
  writeData({ "fs": temporaryFs })
}

async function unsubscribeTo(id, email) {
  var temporaryFs = JSON.parse(readData()).fs
  const registroArtistSubscribers = temporaryFs.find((artistSubscribers) => artistSubscribers.artistId === id);
  if (registroArtistSubscribers !== undefined) {
    temporaryFs = temporaryFs.map((registro) => {
      if (registro.artistId === id) {
        newRegister = new ArtistNewsletter(id, registro.subscribers)
        newRegister.deleteSubscriber(email)
        return newRegister
      } else { return registro }
    })
    console.log(temporaryFs)
    writeData({ "fs": temporaryFs })
  }
}

async function notifySubscribers(artistId, subject, message) {
  const subscribers = await getSubscribers(artistId)
  subscribers.forEach(subscriberEmail => sendMessage(subject, message, subscriberEmail))
}

async function sendMessage(subject, message, subscriber) {
  await new NotificationSender().send(subject, message, subscriber)
}

async function getSubscribers(id) {
  let temporaryFs = JSON.parse(readData()).fs
  const registroArtistSubscribers = temporaryFs.find((artistSubscribers) => artistSubscribers.artistId === id);
  if (registroArtistSubscribers !== undefined) {
    console.log(registroArtistSubscribers)
    return registroArtistSubscribers.subscribers
  } else {
    return []
  }
}

async function subscribersArtistJsonResponse(artistId) {
  const subscriptors = await getSubscribers(artistId)
  return ({
    "artistId": artistId,
    "subscriptors": subscriptors
  })
}

async function deleteSubscribers(id) {
  var temporaryFs = JSON.parse(readData()).fs
  const registroArtistSubscribers = temporaryFs.find((artistSubscribers) => artistSubscribers.artistId === id);
  if (registroArtistSubscribers !== undefined) {
    temporaryFs = temporaryFs.map((registro) => {
      if (registro.artistId === id) {
        newRegister = new ArtistNewsletter(id, registro.subscribers)
        console.log(newRegister)
        newRegister.deleteSubscribers();
        console.log(newRegister)
        return newRegister
      } else { return registro }
    })
    console.log(temporaryFs)
    writeData({ "fs": temporaryFs })
  }
}

app.listen(PORT, () => { console.log(`Listening on ${PORT}`); });
