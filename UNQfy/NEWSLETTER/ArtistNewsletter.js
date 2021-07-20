
class ArtistNewsletter {

    constructor(artistId, subscribers) {
        this.artistId = artistId;
        this.subscribers = subscribers;
    }

    getId() {
        return this.artistId;
    }

    getSubscribers() {
        return this.subscribers;
    }

    addSubscriber(newSubscriber) {
        this.subscribers.push(newSubscriber);
    }

    deleteSubscriber(delSubscriber) {
        this.subscribers = this.subscribers.filter((subscriber) => subscriber !== delSubscriber);
    }

    deleteSubscribers() {
        this.subscribers = [];
    }
}

module.exports = ArtistNewsletter
