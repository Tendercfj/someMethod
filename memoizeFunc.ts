const memoize = function <T extends (...args: any[]) => any>(
  func: T,
  context?: any
): T {
  const cache = Object.create(null);
  return ((...args: any[]) => {
    const key = JSON.stringify(args);   // 多参也能当 key
    if (!cache[key]) {
      cache[key] = func.apply(context || this, args);
    }
    return cache[key];
  }) as T;
};

const add = (a: number, b: number) => {
  console.log('really run');
  return a + b;
};
const mAdd = memoize(add);

console.log(mAdd(1, 2)); // really run  -> 3
console.log(mAdd(1, 2)); // 无日志       -> 3 （直接读缓存）