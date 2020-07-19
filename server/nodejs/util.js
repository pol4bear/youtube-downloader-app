/**
 * Get region code using geoip.
 * @param ip
 * @returns {null|{eu: string, ll: number[], country: string, city: string, timezone: string, range: string, region: string}|undefined|{ll: number[], country: string, city: string, range: string, region: string}}
 */
function getRegion(ip) {
    const geoip = require('geoip-lite');
    return geoip.lookup(ip);
}

module.exports = {
    getRegion,
}
