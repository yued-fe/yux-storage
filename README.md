# yux-storage

yux-storage 是一个基于 HTML5 [IndexedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API) 封装的 Web 数据本地离线存储库。


## 特点

1. 使用类似 [localStorage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)， 无需考虑 IndexedDB 的概念，上手无压力。
1. 支持回调和 [Promises](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 两种方式，各凭所愿。
1. 非常轻量，100 行左右的源码，压缩后更小。

以下是继承 IndexedDB 的特点

1. 可以存储多种类型的数据，而不仅仅是字符串。
3. 储存空间大，一般来说不少于 250MB，甚至没有上限。
2. 异步操作，在进行大量数据存取时不会阻塞应用程序。

## 快速开始

### 安装

1. 直接在 [github](https://github.com/yued-fe/yux-storage) 获取 yux-storage.js

```html
<script src="yux-storage.js"></script>
```

2. 通过 [npm](https://www.npmjs.com/package/yux-storage) 安装

```cmd
npm install yux-storage
```

### 使用

通过 script 引用，会得到一个全局变量 `yuxStorage`

通过 npm 安装，需要 import 导入

```js
import 'yux-storage';
```

在页面中使用

```js
// 回调函数
yuxStorage.getItem('key',doSomethingElse)

// 同样支持promise
yuxStorage.setItem('key').then(doSomethingElse)

// 如果你的环境支持async，那么
const value = await yuxStorage.getItem('key')
console.log(value)
```

## API

获取或设置离线仓库中的数据的 API。风格参考 [localStorage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)

### **GETITEM**

```js
yuxStorage.getItem(key, successCallback)
```

从仓库中获取 key 对应的值并将结果提供给回调函数。如果 `key` 不存在，`getItem()` 将返回 `null`。


*示例*

```js
yuxStorage.getItem('somekey').then(function(value) {
    // 当离线仓库中的值被载入时，此处代码运行
    console.log(value);
})

// async版本:
const value = await yuxStorage.getItem('somekey');
// 当离线仓库中的值被载入时，此处代码运行
console.log(value);

// 回调版本:
yuxStorage.getItem('somekey', function(value) {
    // 当离线仓库中的值被载入时，此处代码运行
    console.log(value);
});

```

### **SETITEM**

```js
yuxStorage.setItem(key, value, successCallback)
```

将数据保存到离线仓库。你可以存储如下类型的 JavaScript 对象：

* Array
* ArrayBuffer
* Blob
* Float32Array
* Float64Array
* Int8Array
* Int16Array
* Int32Array
* Number
* Object
* Uint8Array
* Uint8ClampedArray
* Uint16Array
* Uint32Array
* String

> 可能不太完整，理论上支持任意格式的数据

*示例*

```js
yuxStorage.setItem('somekey', 'some value').then(function (value) {
    // 当值被存储后，可执行其他操作
    console.log(value);
})

// 不同于 localStorage，你可以存储非字符串类型
yuxStorage.setItem('my array', [1, 2, 'three']).then(function(value) {
    // 如下输出 `1`
    console.log(value[0]);
})

// 键名也可以是非字符串，比如一个数组
yuxStorage.setItem([1,2,3], [1, 2, 'three'])

// 还可以存储 file 文件

const file = new File(["foo"], "foo.txt", {
    type: "text/plain",
});

yuxStorage.setItem('file', file)

```

### **REMOVEITEM**

```js
yuxStorage.removeItem(key, successCallback)
```

从离线仓库中删除 key 对应的值。

*示例*

```js
yuxStorage.removeItem('somekey').then(function() {
    // 当值被移除后，此处代码运行
    console.log('Key is cleared!');
})
```

### **CLEAR**

```js
yuxStorage.clear(successCallback)
```

从数据库中删除所有的 key，重置数据库。

> 其实就是遍历，然后执行 REMOVEITEM

*示例*

```js
yuxStorage.clear().then(function() {
    // 当数据库被全部删除后，此处代码运行
    console.log('Database is now empty.');
})
```

### **KEY**

```js
yuxStorage.key(keyIndex, successCallback)
```

根据 key 的索引获取其名

>  有些鸡肋的方法，很多时候我们不知道键的索引。

```js
yuxStorage.key(2).then(function(keyName) {
    // key 名
    console.log(keyName);
})
```

### **KEYS**

```js
yuxStorage.keys(successCallback)
```

获取数据仓库中所有的 key。

>  localStorage API 并没有这个方法，但比上面的 key 要有用的多。

## 兼容性

不支持 `IE`

> 兼容性取决于 [indexedDB](https://caniuse.com/?search=indexedDB) 和 [Promise](https://caniuse.com/?search=Promise)

## 注意事项

默认情况下，内部会暴露一个全局变量 yuxStorage，由于 indexedDB 的打开或者创建都是异步的，可能会出现以下报错

```js
Uncaught ReferenceError: yuxStorage is not defined
```

这时，只需要将方法放在 `new yuxDB()` 的回调或者 Promise 

```js
new yuxDB().then(function(yuxStorage){
    // 初始化完成
    yuxStorage.getItem('somekey')
})

// async
yuxStorage = await new yuxDB();
// 初始化完成
yuxStorage.getItem('somekey')


// 回调方式
new YuxDB(function(yuxStorage){
    // 初始化完成
    yuxStorage.getItem('somekey')
})
```

如果是 import 导入，这需要将 yuxDB 导出

```js
import yuxDB from 'yux-storage'
```

> yuxDB 是整个库的构造函数，new YuxDB() 返回的是一个 Promise 对象， 初始完成后返回的 yuxStorage 才具备以上 API 的各种方法

## 联系我

有相关问题或者意见可与我联系 yanwenbin@yuewen.com
