function getRegion(ip) {
    const geoip = require('geoip-lite');
    return geoip.lookup(ip);
}

module.exports = {
    getRegion,
}
