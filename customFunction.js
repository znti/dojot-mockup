function handleMockDeviceInput(inputData) {
	console.log('Handling mock device input');
	let transformedData = {
		...inputData,
		_processedTime: Date.now(),
	};

	return transformedData;
}

module.exports = function(deviceData, inputData) {
	console.log('Transforming', inputData, 'from device', deviceData);

	let {deviceType} = deviceData;

	switch(deviceType) {
		case 'mock':
			return handleMockDeviceInput(inputData);
			break;
	}
}
