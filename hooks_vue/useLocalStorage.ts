import {customRef, onMounted, onUnmounted} from "vue"


export const useLocalStorage = (key:string,defaultValue:any) => {
  return customRef((track, trigger) =>{
    let value = defaultValue;

    // 从localStorage读取数据
    const read = () => {
      try{
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultValue
      }catch(e){
        console.log(`读取 localStorage[${key}] 失败:`, e)
        return defaultValue
      }
    }

    // 向localStorage写数据
    const write = (newVal) => {
      try{
        localStorage.setItem(key,JSON.stringify(newVal))
      }catch(e){
        console.log(`写入 localStorage[${key}] 失败:`, e)
      }
    }

    // 处理跨标签页同步
    const handleStorageEvent = (event) =>{
      if(event.key === key && event.storageArea === localStorage){
        value = event.newVal ? JSON.parse(event.newVal) : defaultValue
        trigger()
      }
    }

    // 初始化

    value = read()

    // 组件挂载添加时间监听
    onMounted(() => {
      window.addEventListener('storage',handleStorageEvent)
    })

    // 组件卸载移除事件监听
    onUnmounted(() => {
      window.removeEventListener('storage',handleStorageEvent)
    })

    const get = () => {
      track() //标记依赖追踪
      return value
    }

    const set = (newVal) => {
      value = newVal
      write(newVal) //写入数据
      trigger() //触发更新
    }

    return {
      get,
      set,
    }
  })
}

// 使用示例：


const counter = useLocalStorage('counter', 0);
console.log(counter.value)