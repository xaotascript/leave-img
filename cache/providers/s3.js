const AWS = require('aws-sdk');

const {NotCachedError} = require('../errors');

AWS.config.apiVersions = {
    s3: '2006-03-01',
};

class S3Provider {
    constructor(options) {
        this.bucket = options.bucket;
        this.acl = options.acl;
        this.contentType = options.contentType;
        if (options.generation) {
            this.keyPrefix = `${options.generation}/`;
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

    push(key, item) {
        const prefixedKey = this.keyPrefix + key;
        
        const uploadPromise = this.s3.upload({
            Bucket: this.bucket,
            Key: prefixedKey,
            Body: item,
            ACL: this.acl,
            ContentType: this.contentType,
        }).promise();

        return uploadPromise;
    }

    head(key) {
        const prefixedKey = this.keyPrefix + key;

        const getMetaPromise = this.s3.headObject({
            Bucket: this.bucket,
            Key: prefixedKey,
        }).promise();

        return getMetaPromise
            .then(meta => ({...meta, Location: this.makeObjectLocation(key)}))
            .catch(error => {
                if (error.statusCode === 404) {
                    throw new NotCachedError();
                }
                throw error;
            });
    }

    makeObjectLocation(key) {
        const prefixedKey = this.keyPrefix + key;
        return `${this.s3.endpoint.href}${this.bucket}/${prefixedKey}`;
    }
}

module.exports = S3Provider;
