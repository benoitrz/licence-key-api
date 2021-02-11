const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');
const { port } = require('./utils');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
routes(app);

const server = app.listen(port, () => {
    console.log('Listening on port ' + port);
});

module.exports = server;