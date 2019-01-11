const express = require('express');
const app = express();

const serverPort = 8080;

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
	res.send({devices: getDevices()});
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

	addDevice(deviceData);
	res.send(deviceData);

});

app.get('/devices/:deviceId', (req, res) => {
	let {deviceId} = req.params || '<empty>';
	let device = getDevice(deviceId);
	console.debug('Sending device (id', deviceId, ') data:', device);
	res.send(device);
});

let totalMessages = 0;

app.post('/devices/:deviceId/messages', (req, res) => {
	let messageData = req.body || '<empty>';
	let {deviceId} = req.params || '<empty>';

	let startTime;

	startTime = Date.now();
	let device = getDevice(deviceId);
	let deviceLoadTime = (Date.now() - startTime);

	startTime = Date.now();
	if(!device) {
		let message = `Device not found for id ${deviceId}`;
		console.debug(message);
		return res.status(404).send({message});
	}

	addDeviceMessage(deviceId, messageData);
	let allTheRestTime = (Date.now() - startTime);

	res.send();

	if((totalMessages % 500) === 0) {
		console.debug('Loaded device in', deviceLoadTime, 'ms');
		console.debug('Did the rest in', allTheRestTime, 'ms');
	}

	totalMessages++;

});

app.listen(serverPort, () => {
	console.log('Server listening on port', serverPort);
});

/*
 * DeviceManager
 */

const devices = [];

function getDevices() {
	return devices.map(d => d.deviceId);
}
function addDevice(deviceData) {
	devices.push(deviceData);
}

function getDevice(deviceId) {
	return devices.find(d => d.deviceId === deviceId);
}

function addDeviceMessage(deviceId, messageData) {

	let device = getDevice(deviceId);

	if(!device) {
		console.log(`Device not found for id ${deviceId}`);
		return;
	}

	deviceMessages = device.messages || [];

	let generatedMessage = {
		...messageData,
		_serverTime: Date.now(),
	};

	deviceMessages.push(generatedMessage);
	device.messages = deviceMessages;

	onDeviceDataReceived(device, generatedMessage);
}

/*
 * Flow
 */

function onDeviceDataReceived(device, receivedData) {
	console.debug('[ODDR] Got data from', device.deviceId, ':', receivedData);

	let processedData = receivedData;
	onDeviceDataProcessed(device, processedData);
}

function onDeviceDataProcessed(device, processedData) {
	console.debug('[ODDP] Got data from', device.deviceId, ':', processedData);
}
