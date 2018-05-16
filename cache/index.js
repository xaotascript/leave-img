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
                    .then(item =>
                        this.provider.push(key, item)
                            .then(() => item)); 
            });
    }

    getMetaAndSetNotCached(key, getItemToCache) {
        if (typeof this.provider.head !== 'function') {
            throw new Error('Provider doesn\'t support this method');
        }

        return this.provider
            .head(key)
            .catch(error => {
                if (!(error instanceof NotCachedError)) {
                    throw error;
                }

                return getItemToCache()
                    .then(item => this.provider.push(key, item));
            });
    }
}

module.exports = Cache;
