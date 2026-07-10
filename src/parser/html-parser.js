const cheerio = require('cheerio');

class HTMLParser {
    constructor(html) {
        this.$ = cheerio.load(html);
        this.html = html;
    }

    title() {
        return this.$('title').text() || 'no title';
    }

    meta(name) {
        return this.$(`meta[name="${name}"]`).attr('content') || null;
    }

    hrefs() {
        const links = [];
        this.$('a[href]').each((i, el) => {
            const href = this.$(el).attr('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                links.push(href);
            }
        });
        return links;
    }

    images() {
        const imgs = [];
        this.$('img').each((i, el) => {
            const src = this.$(el).attr('src');
            if (src) imgs.push(src);
        });
        return imgs;
    }

    scripts() {
        const scripts = [];
        this.$('script').each((i, el) => {
            const src = this.$(el).attr('src');
            if (src) scripts.push(src);
        });
        return scripts;
    }

    styles() {
        const styles = [];
        this.$('link[rel="stylesheet"]').each((i, el) => {
            const href = this.$(el).attr('href');
            if (href) styles.push(href);
        });
        return styles;
    }

    all() {
        return {
            title: this.title(),
            description: this.meta('description'),
            keywords: this.meta('keywords'),
            hrefs: this.hrefs(),
            images: this.images(),
            scripts: this.scripts(),
            styles: this.styles()
        };
    }
}

module.exports = HTMLParser;