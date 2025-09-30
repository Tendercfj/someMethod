function outer() {
  let count = 0;
  return function inner() {
    ++count;
    return count;
  };
}

const inc = outer();
console.log(inc()); // 1
console.log(inc()); // 2
console.log(inc()); // 3

function makeMultiplier(factor) {
  return (x) => x * factor; // factor 被封闭
}
const triple = makeMultiplier(3);
triple(5); // 15
console.log(triple(2)); // 6
