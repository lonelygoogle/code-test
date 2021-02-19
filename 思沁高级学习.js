// console.log(new Promise((_, b) => b(1))

// let a = Promise.resolve((resolve) => {
//     console.log(1)
// })
// console.log(a)

let promise1 = new Promise(function (a,b) {a(1)})
console.log(promise1)
console.log(Promise.resolve(12345))