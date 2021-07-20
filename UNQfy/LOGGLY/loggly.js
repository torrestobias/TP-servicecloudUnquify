var winston = require('winston');
var { Loggly } = require('winston-loggly-bulk');
var dateTime = require('node-datetime');
let fs = require('fs')
const PORT = 5002;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.listen(PORT, () => console.log('Loggly listening port: ' + PORT));


//Activar o desactivar el servicio
var isActivated = true;

function activate() {
    isActivated = true;
}

function desactivate() {
    isActivated = false;
}

//Configuracion winston
winston.add(new Loggly({
    token: "b6d90548-6a47-4fc6-b71e-e041f0882944",
    subdomain: "mcardozo",
    tags: ["Winston-NodeJS"],
    json: true
}));


//End points 

app.get('/api/estado', (req, res) => {
    res.status(200);
    res.json({
        "state": isActivated
    });
});

app.put('/api/activar', (req, res) => {
    activate()
    res.status(200);
    res.json("Servicio activado");
});

app.put('/api/desactivar', (req, res) => {
    desactivate();
    res.status(200);
    res.json("Servicio desactivado");
});

app.post('/api/log', (req, res) => {
    if (isActivated) {
        //guardo en loggly
        let msj = req.body.message;
        let level = req.body.level;
        winston.log(level, msj);
        //guardo local
        guardarLocal(msj, level);
        res.status(200)
        res.json("Grabado de log con éxito.")
    }
    else {
        res.status(200);
        res.json("El servicio actualmente se encuentra desactivado.")
    }
})

app.get('/ping', (req, res) => {
    console.log('ping arrived!');
    res.json({ message: "pong" });
});

function guardarLocal(message, level) {
    let fechaActual = dateTime.create().format('H:M d-m-Y ');
    let mensaje = `[${fechaActual}] [${message}] [${level}]. \n`
    fs.appendFileSync('./logLocal.txt', mensaje)
}






