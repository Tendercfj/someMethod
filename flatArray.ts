let a = [1,2,3, [1,2,3, [1,2,3]]]
// 变成
let b = [1,2,3,1,2,3,1,2,3]

const flatArray = (arr = [],res = []) => {
  arr.map((item:any) => {
    if(item.isArray()){
      res = res.concat(flatArray(item,[]))
    }else{
      res.push[item]
    }
  })
  return res
}