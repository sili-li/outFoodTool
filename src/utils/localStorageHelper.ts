export enum STORAGE_TYPES {
    STRING = 'string',
    OBJECT = 'object'
}
export const getStorageByKey = (key: string, type: STORAGE_TYPES = STORAGE_TYPES.STRING) => {
    const data = localStorage.getItem(key);
    if (data) {
        return type === STORAGE_TYPES.STRING ? data : JSON.parse(data);
    }
};

export const removeStorageByKey = (key: string) => {
    localStorage.removeItem(key);
};

export const setStorage = (key: string, value?: string | boolean) => {
    if (value) {
        // 注意，innerUser类型是布尔值，为true时会当成string存储，为false时不会存储
        localStorage.setItem(key, value + '');
    }
};
