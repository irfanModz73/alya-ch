const axios = require('axios');
const config = require('./config');
const { getRandomUA } = require('./utils');

class Client {
    constructor(options = {}) {
        this.timeout = options.timeout || config.timeout;
        this.maxRedirects = options.maxRedirects || config.maxRedirects;
        this.userAgent = options.userAgent || getRandomUA();
        this.proxy = options.proxy || null;
    }

    getHeaders() {
        return {
            'User-Agent': this.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'DNT': '1'
        };
    }

    async get(url, options = {}) {
        const headers = { ...this.getHeaders(), ...options.headers };
        const requestConfig = {
            headers,
            timeout: this.timeout,
            maxRedirects: this.maxRedirects,
            validateStatus: status => status < 500
        };
        if (this.proxy) requestConfig.proxy = this.proxy;
        try {
            const response = await axios.get(url, requestConfig);
            return response;
        } catch (error) {
            if (error.response) return error.response;
            throw error;
        }
    }

    async post(url, data, options = {}) {
        const headers = { ...this.getHeaders(), ...options.headers };
        const requestConfig = {
            headers,
            timeout: this.timeout,
            maxRedirects: this.maxRedirects,
            validateStatus: status => status < 500
        };
        if (this.proxy) requestConfig.proxy = this.proxy;
        try {
            const response = await axios.post(url, data, requestConfig);
            return response;
        } catch (error) {
            if (error.response) return error.response;
            throw error;
        }
    }
}

module.exports = Client;