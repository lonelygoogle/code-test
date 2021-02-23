const add1 = x => x + 1;
const mul3 = x => x * 3;
const div2 = x => x / 2;

// console.log(div2(mul3(add1(add1(0)))))

function compose (...func) {
  return function operate(x) {
    if (func.length === 0) return x
    if (func.length === 1) return func[0](x)
    func.reverse()
    let first = func[0](x)
    func = func.slice(1)
    return func.reduce((result,item)=>{
      return item(result)
    }, first)
  }
}

let operate = compose(div2, mul3, add1, add1)
console.log(operate(0))