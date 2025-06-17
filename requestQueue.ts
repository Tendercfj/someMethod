interface QueueItem {
  request: Function;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

/**
 * 一个使用队列系统管理和限制并发 API 请求的类
 * 
 * @class RequestQueue
 * 
 * @property {number} maxConcurrentRequests - 允许的最大并发请求数
 * @property {number} currentConcurrentRequests - 当前正在执行的请求数
 * @property {Array<QueueItem>} queue - 等待中的请求队列
 * 
 * @example
 * ```typescript
 * const queue = new RequestQueue(3); // 最多允许3个并发请求
 * queue.add(() => fetch('/api/data')); 
 * ```
 * 
 * @throws {Error} 如果请求不是函数则抛出错误
 */
class RequestQueue{
  maxConcurrentRequests: number;
  currentConcurrentRequests: number;
  queue: Array<QueueItem>;
  constructor(maxConcurrentRequests){
    this.maxConcurrentRequests = maxConcurrentRequests; // 最大并发请求数
    this.currentConcurrentRequests = 0; // 当前并发请求数
    this.queue = []; // 请求队列
  }

  add(request){
    if (typeof request !== 'function') {
      throw new Error('请求必须是一个函数');
    }
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.processQueue();
    });
  }
  processQueue(){
    if (this.currentConcurrentRequests < this.maxConcurrentRequests && this.queue.length > 0) {
      const items = this.queue.shift();
      if(!items) return; // 确保 items 存在
      const { request, resolve, reject } = items;
      this.currentConcurrentRequests++;
      request()
       .then(resolve)
       .catch(reject)
       .finally(() => {
        this.currentConcurrentRequests--;
        this.processQueue(); // 处理下一个请求
       })
    }
  }
}


// 示例请求函数
const fetchData = (url: string) => {
  return fetch(url).then(res => res.json());
}

// 使用 RequestQueue
const requestQueue = new RequestQueue(5); // 最多允许3个并发请求

const urls = [
  'https://api.example.com/data1',
  'https://api.example.com/data2',
  'https://api.example.com/data3',
  // ... 更多 URL
]

const requests = urls.map(url => {
  return () => fetchData(url);
})

Promise.all(requests.map(req => requestQueue.add(req)))
  .then(data => {
    console.log('所有请求完成:', data);
  })
  .catch(err => {
  console.error('请求出错:', err);
  })