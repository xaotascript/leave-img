const http = require('http')
const fs = require('fs');
const Canvas = require('canvas');
const url = require('url');

const PORT = 8081;

const WIDTH = 400;
const HEIGHT = 552;
const canvas = new Canvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

http.createServer(function (req, res) {
	const u = url.parse(req.url, true);
	const {days} = u.query;
	let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
	daysVal = parseInt(days, 10);
	if (daysVal > 0) {
		const d = '' + daysVal;
		n0 = d[d.length - 4] || '0';
		n1 = d[d.length - 3] || '0';
		n2 = d[d.length - 2] || '0';
		n3 = d[d.length - 1] || '0';
	}
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	ctx.font = "72px Impact";
	ctx.fillStyle = "#000000";
	ctx.fillText(n0, 47, 180);
	ctx.fillText(n1, 135, 180);
	ctx.fillText(n2, 225, 180);
	ctx.fillText(n3, 310, 180);
	fs.readFile(__dirname + '/foreground.png', function(err, squid) {
		if (err) throw err;
		img = new Canvas.Image;
		img.src = squid;
		ctx.drawImage(img, 0, 0, img.width, img.height);

		res.writeHead(200, { 'Content-Type': 'image/png' });
		res.end(canvas.toBuffer(), 'binary');
	});
}).listen(PORT, function () {
	console.log(`Server started on port ${PORT}`);
});
