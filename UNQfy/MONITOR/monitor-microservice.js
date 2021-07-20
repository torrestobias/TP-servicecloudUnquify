const express = require('express'); // Express web server framework
const bodyParser = require('body-parser');
const PORT = 5003;
const app = express();
const ClientAPI = require('../MONITOR/cliente/ClientAPI');
const ClientAPIInstance = new ClientAPI.ClientAPI();
const ClientDiscord = require('../MONITOR/cliente/ClientDiscord');
const ClientDiscordInstance = new ClientDiscord.ClientDiscord();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(PORT, () => { console.log(`Listening on ${PORT}`); });

const services = [
  { name: 'unqfy', uri: process.env.UNQFY_API_HOST || 'http://localhost:5000', state: 'offline', lastState: null, time: new Date().getTime() },
  { name: 'loggin', uri: process.env.LOGGIN_API_HOST || 'http://localhost:5002', state: 'offline', lastState: null, time: new Date().getTime() },
  { name: 'newsletter', uri: process.env.NEWSLETTER_API_HOST || 'http://localhost:5001', state: 'offline', lastState: null, time: new Date().getTime() }
]

console.log('Monitor Activado');
let interval = setInterval(checkServicesStatus, 5000);


function checkServicesStatus(){
    services.forEach(
      service => {
          ClientAPIInstance.check(service.uri).then(
              res => service.state = 'online'
          ).catch(
              res => service.state = 'offline'
          ).then(
              res => {
                  service.time = new Date().getTime();
                  notify(service)
              }
          )
      }
    )
}

function notify(service){
    if(service.lastState !== service.state){
        console.log(`[${new Date(service.time).toLocaleTimeString()}] El servicio ${service.name} se encuentra ${service.state}`);
        ClientDiscordInstance.notify(`[${new Date(service.time).toLocaleTimeString() }] El servicio ${service.name} se encuentra ${service.state}`);
        service.lastState = service.state;
    }
}

function shutdownInterval(){
    console.log('Monitor desactivado');
    clearInterval(interval)
}

function setIntervalOn() {
  console.log('Monitor activado');
  interval = setInterval(checkServicesStatus, 5000)
}

app.get('/api/shutdown', function (req, res) {
  shutdownInterval()
  res.status(200);
  res.json("Monitor desactivado");
});

app.get('/api/poweron', function (req, res) {
  setIntervalOn()
  res.status(200);
  res.json("Monitor activado");
});

app.get('/api/status', function (req, res) {
  res.status(200);
  res.json(services);
});
