const express = require('express');
const app = express();

const serverPort = 8080;

const devices = [];

app.use(express.json());
app.use((req, res, next) => {
	console.log(`${new Date()}: Got a request`);
	next();
});

app.get('/ping', (req, res) => {
	res.send('pong');
});

app.post('/devices', (req, res) => {
	let deviceData = req.body;

	if('deviceId' in deviceData) {
		console.debug('Creating device from', deviceData);
		devices.push(deviceData);
		return res.send(devices);
	} else {
		let message = `'deviceId' field is missing`;
		console.debug(message);
		res.status(400).send({message});
	}

});

app.get('/devices/:deviceId', (req, res) => {
	let {deviceId} = req.params || '<empty>';
	let device = devices.find(d => d.deviceId === deviceId)
	console.debug('Sending device (id', deviceId, ') data:', device);
	res.send(device);
});

app.post('/devices/:deviceId/messages', (req, res) => {
	let messageData = req.body || '<empty>';
	let {deviceId} = req.params || '<empty>';
	let device = devices.find(d => d.deviceId === deviceId)
	if(device) {
		console.log('Device', deviceId, 'sent message', messageData);
		deviceMessages = device.messages || [];
		let generatedMessage = {
			...messageData,
			_serverTime: Date.now(),
		};
		deviceMessages.push(generatedMessage);
		device.messages = deviceMessages;
		res.send();
	} else {
		let message = `Device not found for id ${deviceId}`;
		console.debug(message);
		res.status(404).send({message});
	}
});

app.listen(serverPort, () => {
	console.log('Server listening on port', serverPort);
});
