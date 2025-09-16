const myPromise = new Promise((resolve, reject) => {
  const randomNum = Math.random() * 10;
  if (randomNum > 5) {
    resolve("Success!");
  } else {
    reject("Failure!");
  }
});

myPromise
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
