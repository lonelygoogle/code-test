// let promise1 = new Promise(function (a,b) {a(1)})
// console.log(promise1)
// console.log(Promise.resolve('a'))

// 为了兼容低版本，在没有webpack的情况下，不用箭头、let等ES6语法
function MyPromise(executor) {
    // executor必须是一个函数
    if (typeof executor !== 'function') throw new TypeError('MyPromise resolver undefined is not a function')
    this.PromiseStatus = 'pending'
    this.PromiseValue = undefined
    this.resolveFunc = function () { console.log('初始成功函数')}
    this.rejectFunc = function () { console.log('初始失败函数')}

    var _this = this
    var change = function change (state, value) {
        if (_this.PromiseStatus !== 'pending') return
        _this.PromiseStatus = state
        _this.PromiseValue = value
        setTimeout(function () {
            state === 'fulfilled' ? _this.resolveFunc(value) : _this.rejectFunc(value)
        },0)
    }
    var resolve = function resolve (result) {
        change('fulfilled', result)
    }
    var reject = function reject (reason) {
        change('rejected', reason)
    }
    // executor执行报错，也让实例的状态变为失败
    try {
        executor(resolve,reject)
    } catch (err) {
        change('rejected', err)
    }
}
// 返回一个状态为成功的MyPromise实例
MyPromise.resolve = function (result) {
    return new MyPromise(function (resolve) {
        resolve(result)
    })
}
// 返回一个状态为失败的MyPromise实例
MyPromise.reject = function (reason) {
    return new MyPromise(function (_, reject) {
        reject(reason)
    })
}

MyPromise.prototype = {
    constructor: MyPromise,
    then: function then (resolveFunc, rejectFunc) {
        // 参数不传递，顺延
        if (typeof resolveFunc !== 'function') {
            resolveFunc = function resolveFunc (result) {
                return MyPromise.resolve(result)
            }
        }
        if (typeof rejectFunc !== 'function') {
            rejectFunc = function rejectFunc (reason) {
                return MyPromise.reject(reason)
            }
        }
        this.resolveFunc = resolveFunc
        this.rejectFunc = rejectFunc
    }
}

// console.log(MyPromise.resolve('a'))
// var p1 = new MyPromise(function (resolve, reject) {
//     // resolve('OK');
//     reject('NO');
// });

// p1.then(function(result) {
//     console.log('成功', result)
// }, function (reason) {
//     console.log('失败', reason)
// })

// console.log(p1)

let s1 = new Promise((resolve) => {
    resolve('原版成功')
})
let s2 = new MyPromise((resolve) => {
    resolve('自己版本成功')
})

console.log(s1)
console.log(s2)