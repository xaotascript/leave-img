const Canvas = require('canvas');
const fs = require('fs');
const Cache = require('./cache');
const WIDTH = 400;
const HEIGHT = 552;
const canvas = new Canvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');
const imageCacheOptions = {
    bucket: process.env.S3_BUCKET,
    generation: process.env.GENERATION,
    s3: {
        endpoint: process.env.S3_ENDPOINT,
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
};
const cache = new Cache(require('./cache/providers/s3'), imageCacheOptions);

const drawToBuffer = numbers => {
    ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	ctx.font = "72px Impact";
	ctx.fillStyle = "#000000";
	ctx.fillText(numbers[0], 47, 180);
	ctx.fillText(numbers[1], 135, 180);
	ctx.fillText(numbers[2], 225, 180);
    ctx.fillText(numbers[3], 310, 180);
    
    return new Promise((resolve, reject) => {
        fs.readFile(__dirname + '/foreground.png', function(err, squid) {
            if (err) reject(err);
            img = new Canvas.Image;
            img.src = squid;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            resolve(canvas.toBuffer());
        });
    })
}

const getCached = numbers =>
    cache.getAndSetNotCached(numbers.join(), drawToBuffer.bind(this, numbers));

module.exports = {
    drawToBuffer,
    getCached,
}