const {NotFoundError} = require('../errors');

class NodeProvider {
    constructor() {
        this.storage = {};
    }

    pull(key) {
        return this.storage[key]
                ? Promise.resolve(this.storage[key])
                : Promise.reject(new NotFoundError());
    }

    push(key, item) {
        return Promise.resolve(this.storage[key] = item);
    }
}

module.exports = NodeProvider;
