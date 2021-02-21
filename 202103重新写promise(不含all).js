function MyPromise (executor) {
  this.status = 'pending'
  this.value = undefined
  this.resolveFunc = function () {console.log('成功resolve')}
  this.rejectFunc = function () {console.log('成功reject')}

  var _this = this
  var change = function change (state,value) {
    if (_this.status !== 'pending') return
    _this.status = state
    _this.value = value
    setTimeout(function(){
      state === 'fulfilled' ?
      _this.resolveFunc(_this.value) :
      _this.rejectFunc(_this.value)
    },0)
  }

  var resolve = function resolve (result) {
    change('fulfilled', result)
  }
  var reject = function reject (reason) {
    change('rejected', reason)
  }
  try {
    executor(resolve,reject)
  } catch (err) {
    change('rejected', err)
  }
}

MyPromise.resolve = function (result) {
  return new MyPromise(function(resolve) {
    resolve(result)
  })
}

MyPromise.reject = function (reason) {
  return new MyPromise(function(_,reject) {
    reject(reason)
  })
}

MyPromise.prototype = {
  constructor: MyPromise,
  then: function(resolveFunc, rejectFunc) {
    var _this = this
    // 参数顺延
    if (typeof resolveFunc !== 'function') {
      _this.resolveFunc = function resolveFunc(result) {
        return MyPromise.resolve(result)
      }
    }

    if (typeof rejectFunc !== 'function') {
      _this.rejectFunc = function rejectFunc (reason) {
        return MyPromise.reject(reason)
      }
    }

    return new MyPromise(function(resolve, reject) {
      // _this.resolveFunc = resolveFunc
      _this.resolveFunc = function (result) {
        try {
          var x = resolveFunc(result)
          x instanceof MyPromise ? 
          x.then(resolve, reject) :
          resolve(x)
        } catch (err) {
          // reject(result) 错误写法
          reject(err)
        }
      }
      _this.rejectFunc = function (reason) {
        try {
          var x = rejectFunc(reason)
          x instanceof MyPromise?
          x.then(resolve,reject) :
          resolve(x)
        } catch (err) {
          reject(err)
        }
      }
    })
  },
  catch: function(rejectFunc) {
    return this.then(null,rejectFunc)
  }
}

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