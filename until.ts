// 有些时候，我们需要依赖于异步的返回结果做一些后续处理，until函数在这种场景下非常有用

import { ref, watch } from "vue";

const until = (initial) => {
  const toBe = (val) => {
    return new Promise<void>((resolve)=>{
      if(initial.value === val){
        resolve()
      }else{
        const stop = watch(initial,(newVal) => {
          if(newVal === val){
            resolve()
            stop()
          }
        })
      }
    })
  }
  return {
    toBe
  }
}

// 使用示例
const count = ref(0)
async function increase() {
  count.value = 0
  setInterval(() => {
    count.value++
  }, 1000)
  await until(count).toBe(3)
  console.log(count.value === 3) // 确保输出为true
}

increase()