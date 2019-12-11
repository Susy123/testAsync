# testAsync
研究 async await regenerator runtime
最近处理一个需求，由于webview升级，把以前通过请求方式进行交互schema这种方式全部改为调用原生方法，但是这就相当于要处理$.ajax的功能全部实现。基础能力实现不难，async false怎么实现呢？调用原生方法给的是回调形式。要把异步改同步。
ajax是使用XMLHttpRequest(XHR)对象与服务器进行交互
//XHR调用open来打开一个连接，第三个参数async代表是否异步执行操作，默认为true
XHR.open(method, url, async)
//XHR调用send来发送请求，当代码执行到这一步的时候，运行环境就开始向服务器发送请求了，请求的过程是异步的
XHR.send(null);
当请求结束，返回结果，会把回调函数追加到执行栈底部，等待前面的事件执行完再执行这个回调函数
jq的$.ajax请求是对ajax的一个封装，$.ajax中的async:false变为同步就是把open中的第三个参数变成false实现的同步。要是在底层一点，那就是false可以使运行环境睡眠或等待，请求结束继续执行。
解决办法详见这篇文章
https://www.cnblogs.com/zhuanzhuanfe/p/7391299.html
为了能让在es5里跑起async await。 考虑了es5-async-await（github）,这个插件里依赖fibers和when,这个fibers是nodejs的线程包。
另外也考虑了babel的方式，regenerate-runtime 提供 async 语法编译后的的运行时环境（facebook的runtime:https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js）
 能够支持经过babel编译后的regeneratorRuntime.async；regeneratorRuntime.awrap
转译可见在线的（之前写的示例）https://babeljs.io/repl#?browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=IYZwngdgxgBAZgV2gFwJYHsL3egFASgG8AoGGAN2ACcZkYBeARgG5TaGZgB3YVO5AKYhkBVmSiYQ6ADYCAdNPQBzXMnysAvsWKIUGLIOEESZKgOQIqWCAK4wAClXQBbVCAG5cZqdPID89AB8JmQw7sgAKqjOAugIIrpQaJjGbKEw3jJ-uABM6mkwGgA0jAAM5flkGvjEWkA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&timeTravel=false&sourceType=module&lineWrap=false&presets=es2015%2Creact%2Cstage-2%2Cenv&prettier=false&targets=&version=7.7.4&externalPlugins=。
（在测试中发现，ios11以及chrome较为近期的版本，都已原生支持async和await语法，不够为了不用改写老代码并且保证ios9的支持，还是需要regenerator的runtime）

// 可以看到即使 foo 经过 async await的处理，但是如果onload这个function没有async await的话，这里的同步方法仍然会早于foo里面的方法执行。
所以回到需求本身，除了对老方法进行包装，在实际业务调用的地方仍然要做改造，失去了桥接层统一修改的益处，所以这个方式实际没有太大意义，仍然不如将同步改为异步，或者再思考从原生层进行转换。最后采取方式是，遇到同步请求，则转为xhr进行调用，异步请求走桥接。

参考链接还有：
如何在原生小程序使用 async/await：https://www.jianshu.com/p/1c791e64015a
让原生小程序支持 async/await的runtime.js： https://www.jianshu.com/p/4333dbe84217
这篇文章介绍了babel相关库：https://www.cnblogs.com/chris-oil/p/10747527.html;
                