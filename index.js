const express = require('express');
const app = express();

const serverPort = 8080;

app.use((req,res, next) => {
	console.log(`${new Date()}: Got a request`);
	next();
});

app.get('/ping', (req, res) => {
	res.send('pong');
});

app.listen(serverPort, () => {
	console.log('Server listening on port', serverPort);
});
