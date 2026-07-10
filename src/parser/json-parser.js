class JSONParser {
    constructor(data) {
        this.data = data;
        this.metadata = {
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    format(moduleName, status = 'success', customData = {}) {
        return {
            status: status,
            module: moduleName,
            timestamp: this.metadata.timestamp,
            version: this.metadata.version,
            ...customData
        };
    }

    success(moduleName, data = {}) {
        return this.format(moduleName, 'success', { data });
    }

    error(moduleName, message, data = {}) {
        return this.format(moduleName, 'error', {
            error: message,
            ...data
        });
    }

    wrap(data) {
        return {
            status: 'success',
            data: data,
            timestamp: this.metadata.timestamp
        };
    }

    toJSON() {
        return JSON.stringify(this.data, null, 2);
    }
}

module.exports = JSONParser;