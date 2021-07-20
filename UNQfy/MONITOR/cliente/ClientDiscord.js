const rp = require('request-promise');

class ClientDiscord {
    constructor() {
        this.options = this.getOptionsRequest();
    }

    getOptionsRequest() {
        const options = {
            uri: 'https://discord.com/api/webhooks/862705963345772576/kFXRW-oe5jbe3Vj3tQy3mxs_78lo5ER-7vCLrs6CVpef5pWRtsvHVk_mB6K-XZ1fOiIG',
            json: true,
            body: null
        };
        return options;
    }

    notify(message) {
        this.options.body = { content: message};
        rp.post(this.options)
    }
}

module.exports = {
    ClientDiscord: ClientDiscord,
};