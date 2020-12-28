const Local = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return localStorage.getItem(key);
        }
    },
    set: (key, obj) => {
        localStorage.setItem(key, JSON.stringify(obj));
    },
    clear: () => {
        localStorage.clear();
    },
    all: () => {
        const result = {};
        for(const key in localStorage) {
            result[key] = Local.get(key);
        }
        return result;
    },
    getAccessToken:() => {
        return Local.get('access_token');
    }
};

export default Local;