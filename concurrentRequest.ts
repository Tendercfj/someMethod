/**
 * 并发控制
 * @param {Array<() => Promise<any>>} tasks 返回 Promise 的任务函数数组
 * @param {number} maxConcurrent 最大并发数
 * @returns {Promise<any[]>} 按 tasks 顺序返回结果
 */
const concurrentRequest = (tasks, maxConcurrent) => {
  return new Promise((resolve, reject) => {
    const len = tasks.length
    if(len == 0) return resolve([])

    const res = new Array(len) // 预分配，保证顺序
    let idx = 0 //当前可领取的任务下标
    let running = 0 //当前正在运行的任务数
    let fullfilled = 0 //已完成的任务数

    const runTask = () => {
      const i = idx++ //领取任务序号
      if(i >= len) return; //全部任务领完

      running++ //领取任务，正在运行+1
      const task = tasks[i]
      task()
        .then(data => {
          res[i] = {status: 'fulfilled', value: data}
        })
        .catch(err => {
          res[i] = {status:'rejected', reason: err}
        })
        .finally(() => {
          running-- //任务完成，正在运行-1
          fullfilled++ //已完成+1

          if(fullfilled === len){
            resolve(res) //全部任务完成，返回结果
          } else{
            // 还有任务未完成，继续领取任务
            runTask()
          }
        })
    }
    for(let i = 0; i < maxConcurrent && idx < len; i++){
      runTask() //启动 maxConcurrent 个任务
    }
  })
}

/* ====== 使用示例 ====== */
// 模拟 get 函数
function get(url) {
  return new Promise(resolve => {
    setTimeout(() => resolve(`data from ${url}`), Math.random() * 1000);
  });
}

concurrentRequest(
  Array.from({ length: 20 }, (_, i) => () => get(`/api/task${i + 1}`)),
  5
).then(console.log);
/**
 * [
  { status: 'fulfilled', value: 'data from /api/task1' },
  { status: 'fulfilled', value: 'data from /api/task2' },
  ...
  { status: 'fulfilled', value: 'data from /api/task20' }
]
 */