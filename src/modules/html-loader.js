const HTMLParser = require('../parser/html-parser');

function load(html) {
    return new HTMLParser(html);
}

module.exports = load;