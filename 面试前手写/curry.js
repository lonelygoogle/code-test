// const curry = (fn, ...args) => {
//   console.log('args', args)
//   console.log('fn.length', fn.length)
//   return args.length >= fn.length
//     ? fn(...args)
//     : (..._args) => {
//       console.log('_args', _args)
//       return curry(fn, ...args, ..._args)
//     }
// }

const curry = (fn, ...args) => 
    // 函数的参数个数可以直接通过函数数的.length属性来访问
    args.length >= fn.length // 这个判断很关键！！！
    // 传入的参数大于等于原始函数fn的参数个数，则直接执行该函数
    ? fn(...args)
    /**
     * 传入的参数小于原始函数fn的参数个数时
     * 则继续对当前函数进行柯里化，返回一个接受所有参数（当前参数和剩余参数） 的函数
    */
    : (..._args) => curry(fn, ...args, ..._args);


const a = (fn, ...args) => {
  console.log(args)
}

const test = a(add1)

// function curry(fn, args) {
//   let length = fn.length;
//   args = args || [];
//   console.log('args', args)
//   return function() {
//       let _args = args.slice(0)
//       console.log('arguments.length', arguments.length)
//       for (let i = 0; i < arguments.length; i++) {
//           const arg = arguments[i];
//           _args.push(arg);
//       }
//       if (_args.length < length) {
//           return curry.call(this, fn, _args);
//       }
//       else {
//           return fn.apply(this, _args);
//       }
//   }
// }

function add1(x, y, z) {
  return x + y + z
}
const add = curry(add1)
// console.log(add(1, 2, 3))
console.log(add(1)(2)(3))
// console.log(add(1, 2)(3))
// console.log(add(1)(2, 3))

// var add = function(x) {
//   return function(y) {
//     return x + y;
//   };
// };

// console.log(add(1)(2))
