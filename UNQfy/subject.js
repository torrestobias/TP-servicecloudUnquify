
class Subject {
    constructor() {
      this.observers = [];
    }
    subscribe(observer) {
      this.observers.push(observer);
    }
    unsuscribe(observer) {
      this.observers = this.observers.filter(suscripto => suscripto != observer);
    }
    notify(model, album){
      this.observers.forEach(observer => {
        observer.notify(model, album);
      })
    }
  }

  module.exports = Subject;