const http = require('http')
const url = require('url');

const image = require('./image');

const PORT = 8081;

http.createServer(function (req, res) {
	const u = url.parse(req.url, true);
	const {days} = u.query;
	const numbers = [0, 0, 0, 0];
	const daysVal = parseInt(days, 10);
	if (daysVal > 0) {
		const d = '' + daysVal;
		numbers[0] = d[d.length - 4] || '0';
		numbers[1] = d[d.length - 3] || '0';
		numbers[2] = d[d.length - 2] || '0';
		numbers[3] = d[d.length - 1] || '0';
	}

	image.getCachedMeta(numbers)
		.then(({Location}) => {
			res.writeHead(301, {Location});
			res.end();
		});
}).listen(PORT, function () {
	console.log(`Server started on port ${PORT}`);
});
