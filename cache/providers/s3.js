const AWS = require('aws-sdk');

const {NotCachedError} = require('../errors');

AWS.config.apiVersions = {
    s3: '2006-03-01',
};

class S3Provider {
    constructor(options) {
        this.bucket = options.bucket;
        if (options.generation) {
            this.keyPrefix = `${generation}__`;
        } else {
            this.keyPrefix = '';
        }

        const s3Options = (options && options.s3) ? options.s3 : {};
        this.s3 = new AWS.S3(s3Options);
    }

    pull(key) {
        const prefixedKey = this.keyPrefix + key;

        const getObjectPromise = this.s3.getObject({
            Bucket: this.bucket,
            Key: prefixedKey,
        }).promise();

        return getObjectPromise
            .then(object => object.Body)
            .catch(error => {
                if (error.statusCode === 404) {
                    throw new NotCachedError();
                }
                throw error;
            })
    }

    push(key) {
        const prefixedKey = this.keyPrefix + key;
        
        return item => {
            const uploadPromise = this.s3.upload({
                Bucket: this.bucket,
                Key: prefixedKey,
                Body: item,
            }).promise();

            return uploadPromise
                .then(() => item);
        }
    }
}

module.exports = S3Provider;