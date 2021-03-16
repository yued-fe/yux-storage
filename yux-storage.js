/**
 * @yux-storage.js
 * @author xboxyan
 * @email yanwenbin1991@live.com
 * Created: 20-11-10
 * Update: 21-03-13
 */

class yuxDB {

    constructor() {
        this.ready();
    }

    ready() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this);
            } else {
                this.objectStoreName = 'yux-store';
                const request = window.indexedDB.open('yux-project', 1);
                request.onsuccess = (event) => {
                    this.db = event.target.result;
                    resolve(this);
                };
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(this.objectStoreName)) {
                        db.createObjectStore(this.objectStoreName);
                    }
                };
                request.onerror = (event) => {
                    reject(event);
                }
            }
        })
    }

    init(request, callback) {
        return new Promise((resolve, reject) => {
            const success = value => {
                if (callback && typeof callback === 'function') {
                    callback(false, value);
                }
                resolve(value);
            }
            const error = event => {
                if (callback && typeof callback === 'function') {
                    callback(event);
                }
                reject(event);
            }
            return this.ready().then(() => {
                request(success, error);
            }).catch(error)
        })
    }

    setItem(key, value, callback) {
        return this.init((success, error)=>{
            const request = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName).put(value, key);
            request.onsuccess = () => success(value);
            request.onerror = error;
        }, callback)
    }

    getItem(key, callback) {
        return this.init((success, error)=>{
            const request = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName).get(key);
            request.onsuccess = () => success(request.result);
            request.onerror = error;
        }, callback)
    }

    removeItem(key, callback) {
        return this.init((success, error)=>{
            const request = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName).delete(key);
            request.onsuccess = () => success(key);
            request.onerror = error;
        }, callback)
    }

    key(index, callback) {
        return this.init((success, error)=>{
            const request = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName).getAllKeys();
            request.onsuccess = () => success(request.result[index]);
            request.onerror = error;
        }, callback)
    }

    keys(callback) {
        return this.init((success, error)=>{
            const request = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName).getAllKeys();
            request.onsuccess = () => success(request.result);
            request.onerror = error;
        }, callback)
    }

    clear(callback) {
        return this.init((success, error)=>{
            const request = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName).clear();
            request.onsuccess = () => success(null);
            request.onerror = error;
        }, callback)
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = new yuxDB();
} else {
    window.yuxStorage = new yuxDB();
}