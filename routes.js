const crypto = require('crypto');
const { formatString, endpointPath, authorizationSecret } = require('./utils');

const appRouter = (app) => {
 	const internalPrivateKey = crypto.randomBytes(64).toString('hex');

	app.post(endpointPath, (req, res) => {
	  	let { fullName, softwareName, secret } = req.body;
		
		if (!fullName) return res.status(400).send("'fullName' parameter is missing.");
		if (!softwareName) return res.status(400).send("'softwareName' parameter is missing.");
		if (!secret) return res.status(400).send("'secret' parameter is missing.");
		if (secret !== authorizationSecret) return res.status(401).send('Not authorized to access this ressource.');

		fullName = formatString(fullName);
		softwareName = formatString(softwareName);
		secret = formatString(secret);

		const hashInput = fullName + softwareName + authorizationSecret + internalPrivateKey;
		const hashOutput = crypto.createHash('md5').update(hashInput).digest('hex');

		res.status(200).send(hashOutput);
	});

	app.get(endpointPath + '/:software', (req, res) => {
		let software = req.params.software;
		let { fullName, key } = req.query;

		if (!software) return res.status(400).send("'software' query is missing.");
		if (!fullName) return res.status(400).send("'fullName' parameter is missing.");
		if (!key) return res.status(400).send("'key' parameter is missing.");

		fullName = formatString(fullName);
		software = formatString(software);
		
		const hashInput = fullName + software + authorizationSecret + internalPrivateKey;
		const hashOutput = crypto.createHash('md5').update(hashInput).digest('hex');

		if (hashOutput === key) res.status(204).send('Software key is valid.');
		else res.status(404).send('Software key is invalid.');
	});
}

module.exports = appRouter;