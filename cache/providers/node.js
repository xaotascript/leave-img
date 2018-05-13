const {NotFoundError} = require('../errors');

class NodeProvider {
    constructor() {
        this.storage = {};
    }

    pull(key) {
        return new Promise((resolve, reject) =>
            this.storage[key]
                ? resolve(this.storage[key])
                : reject(new NotFoundError()));
    }

    push(key) {
        return item =>
            new Promise((resolve, reject) =>
                resolve(this.storage[key] = item));
    }
}

module.exports = NodeProvider;
