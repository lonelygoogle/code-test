function curry(fn, args) {
  let length = fn.length
  args = args || []
  return function () {
    let _args = args.slice(0)
    console.log('arguments.length', arguments.length)
    for (let i = 0; i < arguments.length; i++) {
      const item = arguments[i]
      _args.push(item)
    }
    if (_args.length < length) {
      return curry.call(this, fn, _args)
    } else {
      return fn.apply(this, _args)
    }
  }
}

function add1(x, y, z) {
  return x + y + z
}
const add = curry(add1)
console.log(add(1, 2, 3))
console.log(add(1)(2)(3))
console.log(add(1, 2)(3))
console.log(add(1)(2, 3))
