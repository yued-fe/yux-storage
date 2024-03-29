# yux-storage

yux-storage 是一个基于 HTML5 [IndexedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API) 封装的 Web 本地数据离线存储库。

## 特点

1. 使用类似 [localStorage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)， 无需考虑 IndexedDB 的复杂概念，上手无压力。
1. 支持回调和 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 两种方式，各凭所愿。
1. 无任何依赖，非常轻量，100 行左右的源码，压缩后更小。

以下是继承 IndexedDB 的特点

1. 可以存储多种类型的数据，而不仅仅是字符串，无需序列化处理。
1. 储存空间大，一般来说不少于 250MB，甚至没有上限。
1. 异步操作，在进行大量数据存取时不会阻塞应用程序。

## 适用场景

适用于复杂对象、经常需要序列化处理的数据操作，否则使用 localStorage 更加方便

## 快速开始

### 安装

1. 直接在 [github](https://github.com/yued-fe/yux-storage) 获取 yux-storage.js

```html
<script type="module" src="yux-storage.js"></script>
```

> 注意，`script`标签需要添加`type="module"`属性

2. 直接使用 unpkg [在线链接](https://unpkg.com/yux-storage)

```html
<script type="module" src="https://unpkg.com/yux-storage"></script>
```

3. 通过 [npm](https://www.npmjs.com/package/yux-storage) 安装

```cmd
npm i yux-storage
```

### 使用

通过 script 引用，会得到一个全局变量 `yuxStorage`

通过 npm 安装，需要 import 导入

```js
import yuxStorage from 'yux-storage';
```

现在浏览器也可以通过这种方式引入

```html
<script type="module">
    import yuxStorage from './yux-storage.js'
</script>
```

在页面中使用

```js
// 回调函数
yuxStorage.getItem('key',function(err,value){
    if (err) {
        console.log('出错了')
        // 类似于 nodejs 回调格式
    } else {
        console.log(value)
    }
})

// 同样支持promise
yuxStorage.setItem('key').then(doSomethingElse)

// 如果你的环境支持async，那么
const value = await yuxStorage.getItem('key')
console.log(value)

// 如果你想监听数据的更新，那么
yuxStorage.addEventListener((type, data) => {
    console.log(type, data)
    // ‘setItem’, '{key, value}'
})
```

## 测试用例

可访问 [yux-storage测试用例](https://jsbin.com/bigamer/edit?console,output)，建议打开控制台哦（记得打开右上角Auto-run JS）~

另外可访问[这里](https://yued-fe.github.io/yux-storage/)，需要打开控制台查看

## 错误处理

一般情况下报错都是参数不合法导致，例如设置添加一个键为`Object`的操作

```js
DOMException: Failed to execute 'get' on 'IDBObjectStore': The parameter is not a valid key.
```

> 以下 err 为错误信息

1. 回调函数直接通过第一个参数判断

```js
// 回调函数
yuxStorage.getItem('key',function(err,value){
    if (err) {
        console.log('出错了',err)
    } else {
        console.log(value)
    }
})
```

2. promsie 可以通过catch来捕获

```js
yuxStorage.getItem('key').then(function(key) {
    console.log(key);
}).catch(err => {
    console.log('出错了',err)
})
```

3. async/await 可以通过 try...catch 来捕获

```js
try {
    const  key = await yuxStorage.getItem('key');
} catch (error) {
    console.log('出错了',err)
}
```

## 多数据库

默认情况下会创建名为`yux-project`的数据库，如果有多数据库需求，可以通过`YuxDB`自行创建

```js
import { YuxDB } from 'yuxStorage'
const MyStorage = new YuxDB('test')
```

> 在多账号下本地储存比较有用

## API

获取或设置离线仓库中的数据的 API。风格参考 [localStorage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)

### **GETITEM**

```js
yuxStorage.getItem(key, callback)
```

从仓库中获取 key 对应的值并将结果提供给回调函数。如果 `key` 不存在，`getItem()` 将返回 `undefined`。

> 所有回调函数的第一个参数为**错误信息**，如果为 `false`，说明设置正常

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
yuxStorage.getItem('somekey', function(err,value) {
    // 当离线仓库中的值被载入时，此处代码运行
    console.log(err, value);
});

```

### **SETITEM**

```js
yuxStorage.setItem(key, value, callback)
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

> 可能不太完整，理论上支持任意格式的数据，不能是 function

*示例*

```js
yuxStorage.setItem('somekey', 'some value').then(function (value) {
    // 当值被存储后，可执行其他操作
    console.log(value);
})

// 不同于 localStorage，你可以存储非字符串类型（强烈推荐，无需序列化处理）
yuxStorage.setItem('my array', [1, 2, 'three']).then(function(value) {
    // 如下输出 `1`
    console.log(value[0]);
})

// 键名也可以是数组或者数字（不推荐，一般用字符串就足够了）
yuxStorage.setItem([1,2,3], [1, 2, 'three'])

// 还可以存储 file 文件

const file = new File(["foo"], "foo.txt", {
    type: "text/plain",
});

yuxStorage.setItem('file', file)

// 报错，不能是function
yuxStorage.setItem('file', function(){})
```

### **REMOVEITEM**

```js
yuxStorage.removeItem(key, callback)
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
yuxStorage.clear(callback)
```

从数据库中删除所有的 key，重置数据库。

> !小心使用，会删除所有数据

*示例*

```js
yuxStorage.clear().then(function() {
    // 当数据库被全部删除后，此处代码运行
    console.log('Database is now empty.');
})
```

### **KEY**

```js
yuxStorage.key(keyIndex, callback)
```

根据 key 的索引获取其名，如果不存在返回 `undefined`

>  有些鸡肋的方法，很多时候我们不知道键的索引。

*示例*

```js
yuxStorage.key(2).then(function(keyName) {
    // key 名
    console.log(keyName);
})
```

### **KEYS**

```js
yuxStorage.keys(callback)
```

获取数据仓库中所有的 key，如果不存在返回空数组`[]`。

>  localStorage API 并没有这个方法，但比上面的 key 要有用的多。

*示例*

```js
yuxStorage.keys().then(function(keyNames) {
    // 所有的key名
    console.log(keyNames);
})
```

## 监听器

如果想监听数据的更新，可以使用`addEventListener`方法，`setItem`、`removeItem`、`clear` 都会触发回调

```js
yuxStorage.addEventListener((type, data, projectName) => {
    console.log(type, data, projectName)
    // ‘setItem’, '{key, value}', 'yux-project'
})
```

同时也支持全局调用，可以通过监听 `document` 自定义事件

```js
document.addEventListener('yuxStorage', ev => {
    // 自定义事件的数据在 ev.detail
    const [type, data, projectName] = ev.detail;
    console.log(type, data, projectName)
    // ‘setItem’, '{key, value}', 'yux-project'
})
```

> 支持多次调用

## 兼容性

现代浏览器，包括移动端，不支持 `IE`

> 兼容性取决于 [indexedDB](https://caniuse.com/?search=indexedDB) 和 [Promise](https://caniuse.com/?search=Promise)


## 联系我

有相关问题或者意见可与我联系 yanwenbin1991@live.com
