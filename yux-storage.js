/**
 * @yux-storage.js
 * @author xboxyan
 * @email yanwenbin1991@live.com
 * Created: 20-11-10
 * Update: 21-03-13
 */

class yuxDB {

    constructor() {
        this.ready()
    }

    ready() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this)
            } else {
                this.objectStoreName = 'yux-store';
                const request = window.indexedDB.open('yux-project', 1);

                request.onsuccess = (event) => {
                    this.db = event.target.result;
                    resolve(this)
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

    setItem(key, value, callback) {
        return new Promise((resolve, reject) => {
            const fail = event => {
                if (callback && typeof callback === 'function') {
                    callback(event);
                }
                reject(event);
            }
            return this.ready().then(() => {
                const request = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName).put(value, key);
                request.onsuccess = (event) => {
                    if (callback && typeof callback === 'function') {
                        callback(false, value);
                    }
                    resolve(value);
                };
                request.onerror = fail;
            }).catch(fail)
        })
    }

    getItem(key, callback) {
        return new Promise((resolve, reject) => {
            const fail = event => {
                if (callback && typeof callback === 'function') {
                    callback(event);
                }
                reject(event);
            }
            return this.ready().then(() => {
                const request = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName).get(key);
                request.onsuccess = (event) => {
                    if (callback && typeof callback === 'function') {
                        callback(false, request.result);
                    }
                    resolve(request.result);
                };
                request.onerror = fail;
            }).catch(fail)
        })
    }

    removeItem(key, callback) {
        return new Promise((resolve, reject) => {
            const fail = event => {
                if (callback && typeof callback === 'function') {
                    callback(event);
                }
                reject(event);
            }
            return this.ready().then(() => {
                const request = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName).delete(key);
                request.onsuccess = (event) => {
                    if (callback && typeof callback === 'function') {
                        callback(false, request.result);
                    }
                    resolve();
                };
                request.onerror = fail;
            }).catch(fail)
        })
    }

    key(index, callback) {
        return new Promise((resolve, reject) => {
            const fail = event => {
                if (callback && typeof callback === 'function') {
                    callback(event);
                }
                reject(event);
            }
            return this.ready().then(() => {
                const request = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName).getAllKeys();
                request.onsuccess = (event) => {
                    if (callback && typeof callback === 'function') {
                        callback(false, request.result[index]);
                    }
                    resolve(request.result[index]);
                };
                request.onerror = fail;
            }).catch(fail)
        })
    }

    keys(callback) {
        return new Promise((resolve, reject) => {
            const fail = event => {
                if (callback && typeof callback === 'function') {
                    callback(event);
                }
                reject(event);
            }
            return this.ready().then(() => {
                const request = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName).getAllKeys();
                request.onsuccess = (event) => {
                    if (callback && typeof callback === 'function') {
                        callback(false, request.result || []);
                    }
                    resolve(request.result || []);
                };
                request.onerror = fail;
            }).catch(fail)
        })
    }

    clear(callback) {
        return new Promise((resolve, reject) => {
            const fail = event => {
                if (callback && typeof callback === 'function') {
                    callback(event);
                }
                reject(event);
            }
            return this.ready().then(() => {
                const objectStore = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName);
                const request = objectStore.getAllKeys();
                request.onsuccess = (event) => {
                    const p = request.result.map(key => {
                        return new Promise((resolve, reject) => {
                            const request = objectStore.delete(key);
                            request.onsuccess = (event) => {
                                resolve();
                            };
                        })
                    })
                    Promise.all(p).then(() => {
                        if (callback && typeof callback === 'function') {
                            callback(false);
                        }
                        resolve();
                    }).catch(fail);
                };
            }).catch(fail)
        })
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = new yuxDB();
} else {
    window.yuxStorage = new yuxDB();
}