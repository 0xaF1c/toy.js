# toy.js

# 一个迷你发布者模式的实现
<!-- [bilibili 尤雨溪教你写vue](https://bilibili.com/video/BV1d4411v7UX) -->

- 首先是 `Object.defineProperty` api 的使用

```js
Object.defineProperty(state, key {
  get() {}
  set() {}
})
```
这没啥好说的 具体参见[mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

- 依赖跟踪

定义一个 `function autorun` 接收一个update方法(这是这个update就可以被称为依赖) 他会在更新的时候执行

```js
let activeUpdate
function autorun(update) {
  function warppedUpdate() {
    activeUpdate = warppedUpdate
    update()
    activeUpdate = null
  }

  warppedUpdate()
}
```
通过 `warppedUpdate` 方法的封装 其实就形成了 一种称之为 reative zone 的空间 在这个堆栈(update function)里 也只能在这里才能订阅依赖 只有在这个堆栈里activeUpdate才是存在的

***

定义一个 `class Dep` 他有两个方法 notify 和 depend
```js
class Dep {
  depend() {
    if (activeUpdate) {
      // 订阅依赖
      this.subscribers.add(activeUpdate)
    }
  }

  notify() {
    // 执行所有订阅的依赖
    this.subscribers.forEach(sub => sub())
  }
}
```

- 最后结合起来
定义一个 `function observe` 接收一个state: any的数据 在这里就有订阅依赖和执行更新通知的机会了

```js

function observe(state) {

  // 这里省略遍历过程
  let internalValue = state[key]
  Object.defineProperty(state, key，{
    get() {
      return internalValue
      dep.depend()
      // 订阅依赖
      // 此时需要在 update堆栈中调用 变量的 getter 才可以触发
    },
    set(newValue) {
      internalValue = newValue
      dep.notify()
      // 调用通知
    }
  })
}

```
