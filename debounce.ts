/**
 * 防抖函数
 * @param func 要执行的函数
 * @param wait 延迟时间
 * @returns 
 */
const debounce = (func: Function, wait = 500) => {
  let timer: any = null
  return function (...args) {
    if(timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}