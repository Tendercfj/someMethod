/**
 * 手写instanceOf
 * @param instance 
 * @param classOrFunc 
 * @returns 
 */
// 实例.__ptoto__ === 构造函数.prototype
function _insanceOf(instance: any, classOrFunc: any): boolean {
   // 由于instance要检测的是某对象，需要有一个前置判断条件
   //基本数据类型直接返回false
   if(typeof instance!== 'object' || instance === null){
      return false;
   }
    let proto = Object.getPrototypeOf(instance); // 等价于 instance.__ptoto__
    while(proto) { // 当proto == null时，说明已经找到了Object的基类null 退出循环
        // 实例的原型等于当前构造函数的原型
        if(proto == classOrFunc.prototype) return true;
        // 沿着原型链__ptoto__一层一层向上查
        proto = Object.getPrototypeOf(proto); // 等价于 proto.__ptoto__
    }

    return false
}