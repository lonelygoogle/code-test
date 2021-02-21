function MyPromise(executor) {
  this.status = 'pending'
  this.value = undefined
  this.resolveFunc = function () {}
  this.rejectFunc = function () {}

  var _this = this
  var change = function change(state, value) {
    if (_this.status !== 'pending') return
    _this.status = state
    _this.value = value
    setTimeout(function () {
      state === 'fulfilled'
        ? _this.resolveFunc(_this.value)
        : _this.rejectFunc(_this.value)
    }, 0)
  }

  var resolve = function resolve(result) {
    change('fulfilled', result)
  }
  var reject = function reject(reason) {
    change('rejected', reason)
  }
  try {
    executor(resolve, reject)
  } catch (err) {
    change('rejected', err)
  }
}

MyPromise.resolve = function (result) {
  return new MyPromise(function (resolve) {
    resolve(result)
  })
}

MyPromise.reject = function (reason) {
  return new MyPromise(function (_, reject) {
    reject(reason)
  })
}

MyPromise.all = function all(promiseArr) {
  var _this = this
  return new MyPromise(function (resolve, reject) {
    var index = 0
    var results = []
    function notify() {
      if (index >= promiseArr.length) {
        resolve(results)
      }
    }

    for (var i = 0; i < promiseArr.length; i++) {
      ;(function (i) {
        var item = promiseArr[i]
        if (!(item instanceof MyPromise)) {
          results[i] = item
          index++
          notify()
          return
        }
        item
          .then(function (result) {
            results[i] = result
            index++
            notify()
          })
          .catch(function (reason) {
            reject(reason)
          })
      })(i)
    }
  })
}

MyPromise.prototype = {
  constructor: MyPromise,
  then: function (resolveFunc, rejectFunc) {
    var _this = this
    // 参数顺延
    if (typeof resolveFunc !== 'function') {
      resolveFunc = function resolveFunc(result) {
        return MyPromise.resolve(result)
      }
    }

    if (typeof rejectFunc !== 'function') {
      rejectFunc = function rejectFunc(reason) {
        return MyPromise.reject(reason)
      }
    }

    return new MyPromise(function (resolve, reject) {
      // _this.resolveFunc = resolveFunc
      _this.resolveFunc = function (result) {
        try {
          var x = resolveFunc(result)
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (err) {
          // reject(result) 错误写法
          reject(err)
        }
      }
      _this.rejectFunc = function (reason) {
        try {
          var x = rejectFunc(reason)
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (err) {
          reject(err)
        }
      }
    })
  },
  catch: function (rejectFunc) {
    return this.then(null, rejectFunc)
  },
}

function fn1() {
  return MyPromise.resolve(10)
}

function fn2() {
  return MyPromise.reject(20)
}

function fn3() {
  return new MyPromise((resolve) => {
    setTimeout(() => {
      resolve(30)
    }, 1000)
  })
}

var p = MyPromise.all([fn3(), fn2(), fn1(), 40])
p.then(function (result) {
  console.log(`P成功${result}`)
}).catch(function (reason) {
  console.log(`P失败${reason}`)
})

console.log(p)
