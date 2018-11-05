let { events } = require('./events');
let lastID = 100;

module.exports = function (app) {

	app.get('/api/events', (req, res) => {
		res.send(JSON.stringify(events));
	});

	app.post('/api/events', (req, res) => {
		events = req.body.events;
		
		res.sendStatus(200);
	});

	app.get('/lastID', (req, res) => {
		res.send({id: lastID++});
	})

	app.use('*', (req, res) => {
		res.status(404).send('<h1>Page not found</h1');
	});

};