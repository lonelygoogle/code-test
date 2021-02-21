
// 为了兼容低版本，在没有webpack的情况下，不用箭头、let等ES6语法
(function() {
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
                state === 'fulfilled' ? 
                    _this.resolveFunc(_this.PromiseValue) :
                    _this.rejectFunc(_this.PromiseValue)
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
        then: function (resolveFunc, rejectFunc) {
            var _this = this
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
            // this.resolveFunc = resolveFunc
            // this.rejectFunc = rejectFunc
            // + 把传递进来的需要执行的A:resolveFunc/B:rejectFunc进行包装处理
            return new MyPromise(function(resolve,reject) {
                _this.resolveFunc = function (result) {
                    try {
                        // 执行成功，新返回的实例是成功的（特殊情况，
                        // 方法返回的是新的promise实例，则新实例的状态和结果决定了
                        // 返回实例的状态和结果）
                        var x = resolveFunc(result)
                        x instanceof MyPromise ? 
                            x.then(resolve,reject):
                            resolve(x)
                    } catch (err) {
                        // 执行报错，返回失败的实例
                        reject(err)
                    }
                }

                _this.rejectFunc = function (reason) {
                    try {
                        // 执行成功，新返回的实例是成功的（特殊情况，
                        // 方法返回的是新的promise实例，则新实例的状态和结果决定了
                        // 返回实例的状态和结果）
                        var x = rejectFunc(reason)
                        x instanceof MyPromise ? 
                            x.then(resolve,reject):
                            resolve(x)
                    } catch (err) {
                        // 执行报错，返回失败的实例
                        reject(err)
                    }
                }
            })
        },
        catch: function (rejectFunc) {
            return this.then(null, rejectFunc)
        }
    }

    // 支持浏览器导入和commonJS/ES6 module导入
    if (typeof window !== undefined) {
        window.MyPromise = MyPromise
    }
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = MyPromise
    }
})()


var p1 = new MyPromise(function (resolve, reject) {
    resolve('OK');
    // reject('NO');
});
console.log('typeof p1', typeof p1)
var p2 = p1.then(function (result) {
    console.log(`P1成功${result}`);
    return MyPromise.reject('P1 OK');
}, function (reason) {
    console.log(`P1失败${reason}`);
    return 'P1 NO';
});

console.log(p2)
var p3= p2.then(function (result) {
    console.log(`P2成功${result}`);
    return 'P2 OK';
}, function (reason) {
    console.log(`P2失败${reason}`);
    return 'P2 NO';
});
console.log(p3)