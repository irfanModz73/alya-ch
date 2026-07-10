# 🚀 Alya-CH

Alya-CH adalah library Node.js berbasis Cheerio untuk keperluan:
- Scan Cloudflare Protection
- Extract Sitekey (hCaptcha, ReCaptcha, Turnstile)
- Bypass & Get Source Code
- Vulnerability Scanner (XSS, SQLi, Path Traversal, RCE)
- HTML Parser dengan Cheerio
- Bypass hCaptcha via API

Made with ❤️ by irfan

---

# 📦 Installation

npm install https://github.com/irfanModz73/alya-ch.git

atau pake yarn:

yarn add https://github.com/irfanModz73/alya-ch.git

---

# 🚀 Quick Start

const Alya = require('alya-ch');
const alya = new Alya();

Cloudflare Scan
const cf = await alya.scanCF('https://target.com');
console.log(cf);

Extract Sitekey
const keys = await alya.sitekey('https://target.com');
console.log(keys);

---

# 🛠️ API Reference

## new Alya(options)

Initialize AlyaCH instance.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| options.timeout | number | 30000 | Request timeout (ms) |
| options.maxRedirects | number | 10 | Max redirect follow |
| options.userAgent | string | random | Custom User-Agent |
| options.proxy | object | null | Proxy configuration |

Contoh:

const alya = new Alya({
    timeout: 60000,
    userAgent: 'Mozilla/5.0 (Custom)'
});

---

## scanCF(target)

Scan target untuk Cloudflare protection.

await alya.scanCF('https://target.com');

Output:

{
  "status": "success",
  "module": "cf-scan",
  "timestamp": "2026-07-10T12:00:00.000Z",
  "version": "1.0.0",
  "data": {
    "target": "https://target.com",
    "statusCode": 200,
    "detected": true,
    "challenge": false,
    "challengeType": "none",
    "rayId": null,
    "cacheStatus": null,
    "server": "cloudflare"
  }
}

---

## sitekey(target)

Ekstrak sitekey dari halaman target (hCaptcha, ReCaptcha, Turnstile).

await alya.sitekey('https://target.com');

Output:

{
  "status": "success",
  "module": "sitekey",
  "timestamp": "2026-07-10T12:00:00.000Z",
  "version": "1.0.0",
  "data": {
    "target": "https://target.com",
    "statusCode": 200,
    "sitekeys": {
      "hcaptcha": ["a1b2c3d4-..."],
      "recaptcha": [],
      "turnstile": []
    },
    "total": 1
  }
}

---

## getSource(target)

Bypass Cloudflare dan dapatkan source code HTML. File akan disimpan sebagai source_byypased.html.

await alya.getSource('https://target.com');

Output:

{
  "status": "success",
  "module": "source-bypass",
  "timestamp": "2026-07-10T12:00:00.000Z",
  "version": "1.0.0",
  "data": {
    "target": "https://target.com",
    "statusCode": 200,
    "contentLength": 12345,
    "fileSaved": "source_byypased.html"
  }
}

---

## vuln(target)

Scan vulnerability (XSS, SQLi, Path Traversal, RCE).

await alya.vuln('https://target.com');

Output:

{
  "status": "success",
  "module": "vulnerability",
  "timestamp": "2026-07-10T12:00:00.000Z",
  "version": "1.0.0",
  "data": {
    "target": "https://target.com",
    "totalTests": 24,
    "vulnerableCount": 2,
    "results": [
      {
        "type": "xss",
        "payload": "<script>alert('XSS')</script>",
        "statusCode": 200,
        "vulnerable": true,
        "responseLength": 1234
      }
    ]
  }
}

---

## byypassCF(target)

Bypass hCaptcha via API. Otomatis extract sitekey dan coba bypass pake API.

await alya.byypassCF('https://target.com');

Output:

{
  "status": "success",
  "module": "hcaptcha-bypass",
  "timestamp": "2026-07-10T12:00:00.000Z",
  "version": "1.0.0",
  "data": {
    "target": "https://target.com",
    "sitekey": "a1b2c3d4-...",
    "sitekeys": {
      "hcaptcha": ["a1b2c3d4-..."],
      "recaptcha": [],
      "turnstile": []
    },
    "bypassResult": null,
    "message": "sitekey extracted, manual solve required"
  }
}

---

## load(html)

Load dan parse HTML string pake Cheerio.

const parser = alya.load('<html><head><title>Test</title></head><body></body></html>');
console.log(parser.title());
console.log(parser.hrefs());
console.log(parser.images());
console.log(parser.scripts());
console.log(parser.styles());
console.log(parser.all());

---

## extractSitekeys(html)

Ekstrak sitekey dari HTML string (tanpa request).

const keys = alya.extractSitekeys(htmlString);
console.log(keys);

---

## detectCF(html, headers)

Deteksi Cloudflare dari HTML dan headers.

const cf = alya.detectCF(htmlString, responseHeaders);
console.log(cf);

---

## delay(min, max)

Random delay (ms).

await alya.delay(500, 2000);

---

## randomUA()

Dapatkan random User-Agent.

const ua = alya.randomUA();
console.log(ua);

---

# 📝 Contoh Lengkap

const Alya = require('alya-ch');
const alya = new Alya();

(async () => {
    const target = 'https://target.com';

    const cf = await alya.scanCF(target);
    console.log('Cloudflare:', cf.data.detected);

    const keys = await alya.sitekey(target);
    console.log('Sitekeys:', keys.data.sitekeys);

    const source = await alya.getSource(target);
    console.log('Source saved:', source.data.fileSaved);

    const vuln = await alya.vuln(target);
    console.log('Vulnerabilities:', vuln.data.vulnerableCount);

    const bypass = await alya.byypassCF(target);
    console.log('Bypass:', bypass.data.message);
})();

---

# 📁 Struktur Folder

alya-ch/
├── src/
│   ├── core/
│   │   ├── client.js
│   │   ├── config.js
│   │   └── utils.js
│   ├── modules/
│   │   ├── cf-scan.js
│   │   ├── sitekey.js
│   │   ├── source-bypass.js
│   │   ├── vulnerability.js
│   │   ├── hcaptcha-bypass.js
│   │   └── html-loader.js
│   ├── parser/
│   │   ├── html-parser.js
│   │   └── json-parser.js
│   └── index.js
├── tests/
│   └── test.js
├── examples/
│   └── example.js
├── package.json
└── README.md

---

# 📄 License

MIT License

Copyright (c) 2026 irfan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

# 🤝 Kontribusi
-irfan
-alya

---

# 💬 Support

- donate: https://irfan-website.edgeone.app/alya/page/support-irfan

---

**Alya-CH** - create by irfan
