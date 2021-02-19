// function uniqueArr(arr) {
//     let obj = {}
//     for (let i = 0; i < arr.length; i++) {
//         let item = arr[i]
//         // 利用对象键值对，当键值已经存在时，说明当前项之前出现过了，重复了，用数组最后一项覆盖当前项
//         if (obj[item] !== undefined) {
//             arr[i] = arr[arr.length-1]
//             i--
//             arr.length--
//             continue
//         }
//         obj[item] = item
//     }
// 	return arr
// }

// let a = [0, 2 , 5, 1,4, "true", true, 13, NaN, "NaN", "NaN",false, null, null, undefined, null, NaN, null, undefined,"NaN", 0, "a", 1, 1, 2,3,3,4]
// let b = uniqueArr(a)
// console.log(b)

// function uniqueArr(arr) {
//     if (!Array.isArray(arr)) {
//         console.log('type error!')
//         return
//     }
//     var array = [];
//     for (let i = 0; i < arr.length; i++) {
//         if (array.indexOf(arr[i]) === -1) {
//             array.push(arr[i])
//         }
//     }
//     return array;
// }

function uniqueArr(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    let str = arr.sort((a, b) => a - b).join('@') + '@';
    let reg = /(\d+@)\1*/g,
        ary = []
    console.log(str)
    str.replace(reg, (val, group1) => {
        ary.push(Number(group1.slice(0,group1.length-1)))
    });
    return ary

}
let a = [12, 23, 12, 15, 25, 23, 25, 14, 16, 12, 12];
let b = uniqueArr(a)
console.log(b)