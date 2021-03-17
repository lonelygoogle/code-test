var obj = {
  name: 'Condor',
  fun: fun,
}
var name = 'Hero'
function fun() {
  console.log(this.name)
}

const fn = function fn(x, y) {
  console.log('this', this)
  this.total = x + y;
  return this.total;
};


Function.prototype.Mycall = function Mycall(context, ...parms) {
  context == null ? (context = window) : null
  !/^(object|function)$/i.test(typeof context) ? context = Object(context) : null;
  let result,
    key = Symbol['hsq']
  context[key]=this
  result = context[key](...parms)
  delete context[key]
  return result
}

Function.prototype.MyBind = function MyBind (context, ...params) {
  return (...args) => {
    this.Mycall(context, ...params.concat(args))
  }
}

document.body.onclick = fn.MyBind(obj, 10, 20);