const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function main() {
  rl.on("line", (input) => {
    let result = [];
    for (let char of input) {
      if (char >= "0" && char <= "9") {
        result.push("number");
      } else {
        result.push(char);
      }
    }
    console.log(result.join(""));
  });
}

main();
