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
