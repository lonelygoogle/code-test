let arr = [
    [1, 2, 2],
    [3, 4, 5, 5],
    [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10
];

// arr = arr.flat(Infinity)

// arr = arr.toString().split(',').map(item => parseFloat(item))

// arr = JSON.stringify(arr).replace(/(\[|\])/g,'').split(',').map(item => parseFloat(item))

// while(arr.some(item => Array.isArray(item))) {
//     arr = [].concat(...arr)
// }

Array.prototype.MyFlat = function () {
    let _this = this
    let result = []
    let fn = (arr) => {
        for (let i=0; i< arr.length; i++) {
            let item = arr[i]
            if (Array.isArray(item)) {
                fn(item)
            } else {
                result.push(item)
            }
        }
    }
    fn(_this)
    return result
}

console.log(arr.MyFlat())