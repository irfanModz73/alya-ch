const Client = require('../core/client');
const { extractSitekeysFromHtml } = require('../core/utils');
const JSONParser = require('../parser/json-parser');

async function sitekey(target, options = {}) {
    const parser = new JSONParser();
    const client = new Client(options);
    try {
        const response = await client.get(target);
        const html = response.data || '';
        const keys = extractSitekeysFromHtml(html);
        const total = keys.hcaptcha.length + keys.recaptcha.length + keys.turnstile.length;
        return parser.success('sitekey', {
            target,
            statusCode: response.status,
            sitekeys: keys,
            total
        });
    } catch (error) {
        return parser.error('sitekey', error.message, { target });
    }
}

module.exports = sitekey;