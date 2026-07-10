const Client = require('../core/client');
const fs = require('fs');
const JSONParser = require('../parser/json-parser');

async function getSource(target, options = {}) {
    const parser = new JSONParser();
    const client = new Client(options);
    try {
        const response = await client.get(target);
        const html = response.data || '';
        const filename = options.filename || 'source_byypased.html';
        fs.writeFileSync(filename, html, 'utf8');
        return parser.success('source-bypass', {
            target,
            statusCode: response.status,
            contentLength: html.length,
            fileSaved: filename
        });
    } catch (error) {
        return parser.error('source-bypass', error.message, { target });
    }
}

module.exports = getSource;