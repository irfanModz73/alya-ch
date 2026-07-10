const Client = require('../core/client');
const { detectCloudflare } = require('../core/utils');
const JSONParser = require('../parser/json-parser');

async function scanCF(target, options = {}) {
    const parser = new JSONParser();
    const client = new Client(options);
    try {
        const response = await client.get(target);
        const html = response.data || '';
        const cf = detectCloudflare(html, response.headers);
        return parser.success('cf-scan', {
            target,
            statusCode: response.status,
            detected: cf.detected,
            challenge: cf.challenge,
            challengeType: cf.type,
            rayId: response.headers['cf-ray'] || null,
            cacheStatus: response.headers['cf-cache-status'] || null,
            server: response.headers['server'] || 'unknown'
        });
    } catch (error) {
        return parser.error('cf-scan', error.message, { target });
    }
}

module.exports = scanCF;