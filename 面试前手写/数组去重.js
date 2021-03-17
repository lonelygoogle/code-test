let a = [12, 23, 12, 15, 25, 23, 25, 14, 16, 12, 12]

// es6
function uniqueArr(arr) {
  return [...new Set(arr)]
}

// es5
function uniqueArrES5(arr) {
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    if (obj[item] !== undefined) {
      arr[i] = arr[arr.length - 1]
      i--
      arr.length--
      continue
    }
    obj[item] = item
  }
  return arr
}

let b = uniqueArrES5(a)
console.log(b)

