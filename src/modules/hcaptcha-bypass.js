const Client = require('../core/client');
const { extractSitekeysFromHtml } = require('../core/utils');
const JSONParser = require('../parser/json-parser');

async function byypassCF(target, options = {}) {
    const parser = new JSONParser();
    const client = new Client(options);
    try {
        const response = await client.get(target);
        const html = response.data || '';
        const keys = extractSitekeysFromHtml(html);
        const sitekey = keys.hcaptcha[0] || keys.recaptcha[0] || keys.turnstile[0] || null;
        if (!sitekey) {
            return parser.error('hcaptcha-bypass', 'no sitekey found', { target });
        }
        let bypassResult = null;
        try {
            const apiUrl = `https://api.theresav.biz.id/bypass/find-sitekey?url=${encodeURIComponent(target)}&apikey=irfan_api72`;
            const apiRes = await client.get(apiUrl);
            if (apiRes.data && apiRes.data.status === 'success') {
                bypassResult = apiRes.data;
            }
        } catch (e) {}
        return parser.success('hcaptcha-bypass', {
            target,
            sitekey,
            sitekeys: keys,
            bypassResult: bypassResult || null,
            message: bypassResult ? 'bypass via api success' : 'sitekey extracted, manual solve required'
        });
    } catch (error) {
        return parser.error('hcaptcha-bypass', error.message, { target });
    }
}

module.exports = byypassCF;