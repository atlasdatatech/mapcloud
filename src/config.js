
const config = {
    host: '',
};

export function setConfig(options) {
    for(const key in options) {
        config[key] = options[key];
    }
}

export default config;