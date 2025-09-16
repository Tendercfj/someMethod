// 使用Promise实现红绿灯交替重复亮

/**
 * 红灯3秒亮一次，绿灯2秒亮一次，黄灯1秒亮一次
 * 交替重复亮灯
 * 使用Promise实现
 */


const redLight = () => {
  console.log('红灯亮了')
}
const greenLight = () => {
  console.log('绿灯亮了')
}
const yellowLight = () => {
  console.log('黄灯亮了')
}

const light = (lightFunc, time) => {
  return new Promise<void>((resolve, reject) => {
    lightFunc()
    setTimeout(() => {
      resolve()
    }, time)
  })
}

const step = () => {
  Promise.resolve().then(()=>{
    return light(redLight, 3000)
  }).then(()=>{
    return light(greenLight, 2000)
  }).then(()=>{
    return light(yellowLight, 1000)
  }).then(()=>{
    step()
  })
}

step()