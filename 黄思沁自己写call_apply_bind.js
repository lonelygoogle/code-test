const fn = function fn(x, y) {
    this.total = x + y;
    return this.total;
};

var total = 10
let obj = {
    name: 'obj',
    xxx: 10
};

// 重写call方法
Function.prototype.call = function call(context, ...args) {
    // 当前this是执行的函数
    // context是传入的对象，比如obj
    context === null? context = window: context
    // console.log('当前context', context)
    !/^(object|function)$/i.test(typeof context) ? context = Object(context): context
    let result,
        key = Symbol('hsq')
    context[key] = this
    result = context[key](...args)
    delete context[key]
    return result
}
// let res = fn.call( null , 10, 20);
// console.log(res);

// 重写apply方法
Function.prototype.apply = function apply(context, args) {
    // 当前this是执行的函数
    // context是传入的对象，比如obj
    context === null? context = window: context
    // console.log('当前context', context)
    !/^(object|function)$/i.test(typeof context) ? context = Object(context): context
    let result,
        key = Symbol('hsq')
    context[key] = this
    result = context[key](...args)
    delete context[key]
    return result
}

// 重写bind方法

Function.prototype.bind = function bind(context, ...params) {
    // this是fn 就是真的要执行的函数
    return (...args) => {
        // this是上下文的this
        this.call(context, ...params.concat(args))
        // this.apply(context, params.concat(args))
    }
}


// var array = ['a', 'b'];
// var elements = [0, 1, 2];
// array.push.apply(array, elements);
// console.info(array); // ["a", "b", 0, 1, 2]