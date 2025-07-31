import {ref} from "vue"
import { useEventListener } from "./useEventListener"


export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  useEventListener(window, "mousemove", (e) => {
    x.value = e.clientX
    y.value = e.clientY
  })
  return {x,y}
}

// 使用示例
const { x, y } = useMouse()