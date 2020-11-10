/**
 * @yux-storage.js
 * @author xboxyan
 * Created: 20-11-10
 */

class yuxDB {

    constructor(successCallback) {
        return new Promise((resolve, reject) => {
            this.objectStoreName = 'yux-store';
            const request = window.indexedDB.open('yux-project', 1);

            request.onsuccess = (event) => {
                this.db = event.target.result;
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(this);
                }
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
        })
    }

    setItem(key, value, successCallback) {
        return new Promise((resolve, reject) => {
            const request = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName).put(value, key);
            request.onsuccess = (event) => {
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(value);
                }
                resolve(value);
            };
            request.onerror = (event) => {
                reject(event);
            }
        })
    }

    getItem(key, successCallback) {
        return new Promise((resolve, reject) => {
            const request = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName).get(key);
            request.onsuccess = (event) => {
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(request.result || null);
                }
                resolve(request.result || null);
            };
            request.onerror = (event) => {
                reject(event);
            }
        })
    }

    removeItem(key, successCallback) {
        return new Promise((resolve, reject) => {
            const request = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName).delete(key);
            request.onsuccess = (event) => {
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(equest.result || null);
                }
                resolve();
            };
            request.onerror = (event) => {
                reject(event);
            }
        })
    }

    key(index, successCallback) {
        return new Promise((resolve, reject) => {
            const request = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName).getAllKeys();
            request.onsuccess = (event) => {
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(request.result[index] || null);
                }
                resolve(request.result[index]);
            };
            request.onerror = (event) => {
                reject(event);
            }
        })
    }

    keys(successCallback) {
        return new Promise((resolve, reject) => {
            const request = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName).getAllKeys();
            request.onsuccess = (event) => {
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(request.result || []);
                }
                resolve(request.result || []);
            };
            request.onerror = (event) => {
                reject(event);
            }
        })
    }

    clear(successCallback) {
        return new Promise((resolve, reject) => {
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
                    if (successCallback && typeof successCallback === 'function') {
                        successCallback();
                    }
                    resolve();
                }).catch(event => {
                    reject(event);
                });
            };

        })
    }

}

new yuxDB().then((yuxStorage) => {
    window.yuxStorage = yuxStorage;
})

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = yuxDB;
}

