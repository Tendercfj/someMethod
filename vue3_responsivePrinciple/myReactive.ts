const targetMap = new WeakMap();
let activeEffect;   // 引入activeEffect变量，用于记录当前激活的 effect 函数

const effect = (eff) =>{
  activeEffect = eff;  //1.将副作用赋值给activeEffect
  activeEffect() //2.执行副作用函数
  activeEffect = null;  //3.清空activeEffect
}

const track = (target, key) => {
  if(activeEffect){ // 1.如果有激活的effect，则执行以下操作
    let depsMap = targetMap.get(target);
    if(!depsMap){
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if(!dep){
      depsMap.set(key, (dep = new Set()));
    }
    dep.add(activeEffect);  //2.将当前激活的effect函数添加到dep中
  }
}

const trigger = (target, key) => {
  const depsMap = targetMap.get(target);
  if(!depsMap) return;
  let dep = depsMap.get(key);
  if(dep){
    dep.forEach(eff => eff());  // 执行dep中的所有副作用函数
  }
}

const myReactive = (target) => {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      track(target, key);
      return result;
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      if(oldValue !== result){
        trigger(target, key);
      }
      return result;
    }
  }
  return new Proxy(target, handler);
}

let product = myReactive({
  quantity: 10,
  price: 2
})

let total = 0, salePrice = 0

// 修改effect使用方式，将副作用作为参数传入 effect 函数
effect(()=>{
  total = product.quantity * product.price
})

effect(() => {
  salePrice = product.price * 0.9
})

console.log(total, salePrice) // 20 1.8

product.quantity = 20

console.log(total, salePrice) // 40 1.8

// 总结：
// 1.引入 activeEffect 变量，用于记录当前激活的 effect 函数
// 2.引入 targetMap 变量，用于存储依赖关系
// 3.引入 track 函数，用于收集依赖关系
// 4.引入 trigger 函数，用于触发依赖关系
// 5.引入 myReactive 函数，用于创建响应式对象
// 6.修改 effect 函数，使其接收副作用函数作为参数
// 7.修改 set 函数，使其触发依赖关系