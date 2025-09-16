// 手动实现多个对象的响应式，同时观察对象 a 和对象 b 的变化
// 引入 WeakMap 来实现响应式：用“被观察的对象”做 key，
// 值是一个 Map，用来保存该对象各个属性对应的依赖集合。

/* ---------------- 原始数据 ---------------- */
let product = { price: 10, quantity: 2 }, // 商品对象
  total = 0; // 计算结果

/* ---------------- 核心存储 ---------------- */
// targetMap 是“对象 → 属性依赖映射表”的弱引用映射
// 结构：WeakMap { product => Map { price => Set[effect1, effect2], quantity => Set[...] } }
const targetMap = new WeakMap();

/* ---------------- 业务副作用 ---------------- */
// 真正的“计算”逻辑：只要 product.price 或 product.quantity 变了就重新算总价
const effect = () => {
  total = product.price * product.quantity;
};

/* ---------------- 依赖收集 ---------------- */
// track: 在读取某个对象的某个属性时调用，把当前副作用函数收集起来
const track = (target, key) => {
  let depsMap = targetMap.get(target); // 先拿到这个对象对应的属性 Map
  console.log("track", target, key);
  if (!depsMap) {
    // 第一次访问：创建属性 Map
    targetMap.set(target, (depsMap = new Map()));
    console.log("create new depsMap", target, depsMap);
  }
  let dep = depsMap.get(key); // 再拿到这个属性对应的依赖 Set
  if (!dep) {
    // 第一次访问该属性：创建依赖 Set
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(effect); // 把当前副作用函数丢进去
};

/* ---------------- 触发更新 ---------------- */
// trigger: 在某个对象的某个属性被修改时调用，执行所有收集到的副作用
const trigger = (target, key) => {
  console.log("trigger", target, key);
  const depsMap = targetMap.get(target);
  if (!depsMap) return; // 这个对象从没被 tracked 过，直接 return
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect) => effect()); // 依次执行所有依赖
  }
};

/* ---------------- 演示流程 ---------------- */
// 1. 收集依赖：让 product.price 知道“effect 函数依赖它”
track(product, "price");

console.log(total); // 0 → 还没运行 effect，total 是初始值 0

// 2. 手动跑一次 effect，算出初始总价
effect();
console.log(total); // 20

// 3. 模拟用户改价：先改数据，再手动触发更新
product.price = 20;
trigger(product, "price"); // 执行之前收集到的 effect
console.log(total); // 40

let proxiedProduct = new Proxy(product, {
  get(target, key, receiver) {
    console.log("get", target, key, receiver);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log("set", target, key, value, receiver);
    return Reflect.set(target, key, value, receiver);
  },
});

proxiedProduct.price = 30;
console.log(proxiedProduct.price); // 20
