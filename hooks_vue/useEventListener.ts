import {onMounted, onUnmounted} from "vue"

export function useEventListener(target = window, event, callback) {
  onMounted(()=>{
    target.addEventListener(event,callback)
  })
  onUnmounted(() => {
    target.removeEventListener(event,callback)
  })
  
}