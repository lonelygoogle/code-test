let a = [
  [1, 2, 2],
  [3, 4, 5, 5],
  [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10
];

function Myflat (arr) {
  let result = []
  let fn = (arr) => {
    for (let i=0; i<arr.length;i++) {
      let item = arr[i]
      if (Array.isArray(item)) {
        fn(item)
      } else {
        result.push(item)
      }
    }
  }
  fn(arr)
  return result
}

// console.log(Myflat(a))


// arr = JSON.stringify(a).replace(/(\[|\])/g ,'').split(',').map(item=> parseFloat(item))
// console.log(arr)

arr1 = a.toString().split(',').map(item =>parseFloat(item))
console.log(arr1)