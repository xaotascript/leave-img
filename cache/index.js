const {NotCachedError} = require('./errors');

class Cache {
    constructor(Provider, providerOptions) {
        this.provider = new Provider(providerOptions);
    }

    getAndSetNotCached(key, getItemToCache) {
        return this.provider
            .pull(key)
            .catch(error => {
                if (!(error instanceof NotCachedError)) {
                    throw error;
                }
                return getItemToCache()
                    .then(this.provider.push(key));
            });
    }
}

module.exports = Cache;