const GMailAPIClient = require('./GMailAPIClient');
const gmailClient = new GMailAPIClient();

class NotificationSender {

  constructor() { }

  send(subject, message, subscriber) {

    gmailClient.send_mail(
      subject,
      [
        message,
        '😎'
      ],
      {
        "name": subscriber,
        "email": subscriber,
      },
      {
        "name": "UNQfy newsletter",
        "email": "expovirtual2021@gmail.com",
      }
    ).then((gmailResponse) => {
      console.log("Mail enviado!");
      console.log(gmailResponse);
    }).catch((error) => {
      console.error("Algo salió mal");
      console.error(error);
    })
  }
}

module.exports = NotificationSender;