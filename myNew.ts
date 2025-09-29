function myNew(Func:Function,...args:any[]) {
  // 1.创建一个新对象
  const obj = {} as Object;
  // 2.新对象原型指向构造函数的原型对象
  obj.__proto__ = Func.prototype;
  // 3.构造函数this指向新对象
  const result = Func.apply(obj, args);
  // 4.如果构造函数返回的是对象，则返回这个对象，否则返回新对象
  return  result instanceof Object ? result : obj;

}