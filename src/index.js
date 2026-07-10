const Client = require('./core/client');
const { getRandomUA, randomDelay, extractSitekeysFromHtml, detectCloudflare } = require('./core/utils');
const HTMLParser = require('./parser/html-parser');
const JSONParser = require('./parser/json-parser');
const scanCF = require('./modules/cf-scan');
const sitekey = require('./modules/sitekey');
const getSource = require('./modules/source-bypass');
const vuln = require('./modules/vulnerability');
const byypassCF = require('./modules/hcaptcha-bypass');
const load = require('./modules/html-loader');

class AlyaCH {
    constructor(options = {}) {
        this.options = options;
        this.client = new Client(options);
        this.jsonParser = new JSONParser();
    }

    load(html) {
        return load(html);
    }

    async sitekey(target) {
        const result = await sitekey(target, this.options);
        return this.jsonParser.success('sitekey', result.data);
    }

    async scanCF(target) {
        const result = await scanCF(target, this.options);
        return this.jsonParser.success('cf-scan', result.data);
    }

    async getSource(target) {
        const result = await getSource(target, this.options);
        return this.jsonParser.success('source-bypass', result.data);
    }

    async vuln(target) {
        const result = await vuln(target, this.options);
        return this.jsonParser.success('vulnerability', result.data);
    }

    async byypassCF(target) {
        const result = await byypassCF(target, this.options);
        if (result.status === 'error') {
            return this.jsonParser.error('hcaptcha-bypass', result.data.error, result.data);
        }
        return this.jsonParser.success('hcaptcha-bypass', result.data);
    }

    extractSitekeys(html) {
        return extractSitekeysFromHtml(html);
    }

    detectCF(html, headers = {}) {
        return detectCloudflare(html, headers);
    }

    delay(min = 500, max = 2000) {
        return randomDelay(min, max);
    }

    randomUA() {
        return getRandomUA();
    }
}

module.exports = AlyaCH;
module.exports.create = (options) => new AlyaCH(options);