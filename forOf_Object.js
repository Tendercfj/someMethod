//  不添加迭代器方法，obj解构会报错
//  添加迭代器方法，obj解构正常，for...of循环正常，Object.keys()方法正常

const obj = {
  name: "John",
  age: 30,
  city: "New York",
  [Symbol.iterator]() {
    let index = 0;
    const keys = Object.keys(this);
    return {
      next() {
        if (index < keys.length) {
          return {
            done: false,
            value: obj[keys[index++]],
          };
        }
        return {
          done: true,
          value: undefined,
        };
      },
    };
  },
};

const [name, age, city] = obj;
for (const val of obj) {
  console.log(val);
}
console.log(name, age, city);

const keys = Object.keys(obj);
console.log(keys);

// 也可以通过Generator函数实现迭代器方法
function* objectEntries(obj) {
  let propsKeys = Reflect.ownKeys(obj);
  for (let propKey of propsKeys) {
    yield [propKey, obj[propKey]];
  }
}

let testObj = {
  name: "John",
  age: 30,
  city: "New York",
};

for (let [key, value] of objectEntries(testObj)) {
  console.log(`${key}: ${value}`);
}
