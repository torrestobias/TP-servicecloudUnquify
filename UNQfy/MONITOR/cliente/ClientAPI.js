const rp = require('request-promise');

class ClientAPI {
    constructor(){
        this.options = this.getOptionsRequest();
    }

    getOptionsRequest(){
        const options = {
            uri: null,
            json: true
        };
        return options;
    }

    check(uriService) {
        this.options.uri = uriService + '/ping';
        return rp.get(this.options)
    }
}

module.exports = {
    ClientAPI: ClientAPI,
};