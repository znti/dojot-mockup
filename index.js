const express = require('express');
const app = express();

const serverPort = 8080;

const devices = [];

app.use(express.json());
app.use((req, res, next) => {
	let {method, url} = req;
	console.debug(`${new Date()}: Got a ${method} request on ${url}`);
	next();
});

app.get('/ping', (req, res) => {
	res.send('pong');
});


app.get('/devices', (req, res) => {
	res.send({devices: devices.map(d => d.deviceId)});
});

app.post('/devices', (req, res) => {
	let deviceData = req.body;

	let {deviceId} = deviceData;

	if(devices.find(d => d.deviceId === deviceId)) {
		let message = `Device ${deviceId} already exists`
		console.debug(message);
		return res.status(400).send({message});
	}

	if(!deviceId) {
		let message = '"deviceId" field is missing';
		console.debug(message);
		return res.status(400).send({message});
	}

	console.debug('Creating device from', deviceData);
	devices.push(deviceData);
	res.send(deviceData);

});

app.get('/devices/:deviceId', (req, res) => {
	let {deviceId} = req.params || '<empty>';
	let device = devices.find(d => d.deviceId === deviceId)
	console.debug('Sending device (id', deviceId, ') data:', device);
	res.send(device);
});

let totalMessages = 0;

app.post('/devices/:deviceId/messages', (req, res) => {
	let messageData = req.body || '<empty>';
	let {deviceId} = req.params || '<empty>';

	let startTime;

	startTime = Date.now();
	let device = devices.find(d => d.deviceId === deviceId);
	let deviceLoadTime = (Date.now() - startTime);

	startTime = Date.now();
	if(!device) {
		let message = `Device not found for id ${deviceId}`;
		console.debug(message);
		return res.status(404).send({message});
	}

	deviceMessages = device.messages || [];

	let generatedMessage = {
		...messageData,
		_serverTime: Date.now(),
	};

	deviceMessages.push(generatedMessage);
	device.messages = deviceMessages;
	let allTheRestTime = (Date.now() - startTime);
	res.send();

	if((totalMessages % 500) === 0) {
		console.debug(Date.now(), 'Device', deviceId, 'sent message', messageData, '(message #', totalMessages, ')');
	console.debug('Loaded device in', deviceLoadTime, 'ms');
	console.debug('Did the rest in', allTheRestTime, 'ms');
	}

	totalMessages++;

});

app.listen(serverPort, () => {
	console.log('Server listening on port', serverPort);
});
