const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const server = require('../app');
const { endpointPath, authorizationSecret: secret } = require('../utils');

const softwareName = 'armLicenceApi', fullName = 'Benoit Trzpit';
let newLicenceKey;

describe('Licence key endpoint - generation and validation', () => {
	after(() => {
		server.close();
	});

	it('400 error thrown if no username is provided', (done) => {
		chai.request(server)
			.post(endpointPath)
			.send({ softwareName, secret })
			.end((err, res) => {
				expect(res).to.have.status(400);
				done();
		});
	});

	it('400 error thrown if no software name is provided', (done) => {
		chai.request(server)
			.post(endpointPath)
			.send({ fullName, secret })
			.end((err, res) => {
				expect(res).to.have.status(400);
				done();
		});
	});

	it('401 status returned if secret does not match', (done) => {
		chai.request(server)
			.post(endpointPath)
			.send({ fullName, softwareName, secret: 'test' })
			.end((err, res) => {
				expect(res).to.have.status(401);
				done();
		});
	});
	
	it('Should generate the licence key successfully', (done) => {
		chai.request(server)
			.post(endpointPath)
			.send({ fullName, softwareName, secret })
			.end((err, res) => {
				newLicenceKey = res.text;
				expect(res).to.have.status(200);
				done();
		});
	});
	
	it('404 error thrown if licence key does not match', (done) => {
	    chai.request(server)
	      .get(endpointPath + '/' + softwareName)
	      .query({ fullName, key: '123' })
	      .end((err, res) => {
	        expect(res).to.have.status(404);
	        done();
	      });
	});
	
	it('Should successfully verify a valid licence key', (done) => {
	    chai.request(server)
	      .get(endpointPath + '/' + softwareName)
	      .query({ fullName, key: newLicenceKey })
	      .end((err, res) => {
	        expect(res).to.have.status(204);
	        done();
	      });
	 });
});