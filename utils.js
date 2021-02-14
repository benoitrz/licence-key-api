const endpointPath = '/licence';
const port = 3000;
const authorizationSecret = 'arm_api_thursday';
const formatString = (str) => str.replace(/\s/g,'').toLowerCase();

module.exports = {
    endpointPath, 
    port,
    authorizationSecret,
    formatString,
};