function debounce (callback, wait) {
  let timer = null
  return function anonymous (...params) {
    let context = this
    if (timer) clearTimeout(timer)
    timer = setTimeout(callback.bind(context,...params), wait)
  }
}

