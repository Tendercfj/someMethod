// 手写bind


// 三步骤：

// 1.修改this指向

// 2.动态传递参数
// 方式一：只在bind中传递函数参数
// fn.bind(obj,1,2)()
// 方式二：在bind中传递函数参数，在调用时传递实参
// fn.bind(obj,1,2)(3,4)

// 3.兼容new 关键字


Function.prototype.myBind = function(context){
  //  判断调用对象是否为函数
  if(typeof this!== 'function'){
    throw new TypeError('Error: this is not a function');
  }
  const args = [...arguments].slice(1),
        fn = this;
  return function Fn(){
    // 根据调用方式，传入不同的绑定值
    return fn.apply(this instanceof Fn ? this : context, args.concat(...arguments))
  }
}