/**
 * 手写new的过程
 * @param constructor 
 * @param args 
 * @returns 
 */


function myNew(constructor: Function, ...args) : any {
  // 1. 基于原型链 创建一个新对象，继承构造函数constructor的原型对象（Person.prototype）上的属性
  let newObj = Object.create(constructor.prototype);
  // 添加属性到新对象上 并获取obj函数的结果
  // 调用构造函数，将this调换为新对象，通过强行赋值的方式为新对象添加属性
  // 2. 将newObj作为this，执行 constructor ，传入参数
  let res = constructor.apply(newObj, args); // 改变this指向新创建的对象

  // 3. 如果函数的执行结果有返回值并且是一个对象, 返回执行的结果, 否则, 返回新创建的对象地址
  return typeof res === 'object' ? res: newObj;
}