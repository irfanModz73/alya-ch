const config = require('./config');

function getRandomUA() {
    return config.userAgents[Math.floor(Math.random() * config.userAgents.length)];
}

function randomDelay(min = 500, max = 2000) {
    return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));
}

function extractSitekeysFromHtml(html) {
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    const results = { hcaptcha: [], recaptcha: [], turnstile: [] };
    $('[data-sitekey]').each((i, el) => {
        const key = $(el).attr('data-sitekey');
        const cls = $(el).attr('class') || '';
        if (cls.includes('h-captcha') || cls.includes('hcaptcha')) results.hcaptcha.push(key);
        else if (cls.includes('g-recaptcha')) results.recaptcha.push(key);
        else if (cls.includes('cf-turnstile') || cls.includes('turnstile')) results.turnstile.push(key);
    });
    $('script').each((i, el) => {
        const content = $(el).html() || '';
        let m = content.match(/hcaptcha\.render\s*\(\s*['"]([^'"]+)['"]/i);
        if (m) results.hcaptcha.push(m[1]);
        m = content.match(/grecaptcha\.render\s*\(\s*['"]([^'"]+)['"]/i);
        if (m) results.recaptcha.push(m[1]);
        m = content.match(/turnstile\.render\s*\(\s*['"]([^'"]+)['"]/i);
        if (m) results.turnstile.push(m[1]);
        m = content.match(/sitekey\s*:\s*['"]([^'"]+)['"]/i);
        if (m) {
            const key = m[1];
            if (content.includes('hcaptcha') || content.includes('h-captcha')) results.hcaptcha.push(key);
            else if (content.includes('grecaptcha') || content.includes('recaptcha')) results.recaptcha.push(key);
            else if (content.includes('turnstile') || content.includes('cf-turnstile')) results.turnstile.push(key);
        }
    });
    results.hcaptcha = [...new Set(results.hcaptcha)];
    results.recaptcha = [...new Set(results.recaptcha)];
    results.turnstile = [...new Set(results.turnstile)];
    return results;
}

function detectCloudflare(html, headers) {
    const isCF = !!(headers['cf-ray'] || headers['cf-cache-status'] || html.includes('cloudflare') || html.includes('just a moment') || html.includes('cf-challenge'));
    const challenge = html.includes('cf-challenge') || html.includes('just a moment') || html.includes('cf-browser-verification');
    let type = 'none';
    if (html.includes('hcaptcha')) type = 'hcaptcha';
    else if (html.includes('recaptcha')) type = 'recaptcha';
    else if (html.includes('turnstile')) type = 'turnstile';
    else if (challenge) type = 'browser_verification';
    return { detected: isCF, challenge, type };
}

module.exports = {
    getRandomUA,
    randomDelay,
    extractSitekeysFromHtml,
    detectCloudflare
};