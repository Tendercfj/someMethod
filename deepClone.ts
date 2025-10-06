const deepClone = (obj: any, hash = new WeakMap()) => {
  if(obj === null) return obj
  if(obj instanceof Date) return new Date(obj)
  if(obj instanceof RegExp) return new RegExp(obj)
  if(typeof obj !== 'object') return obj
  if(hash.get(obj)) return hash.get(obj)
  let cloneObj = new obj.constructor()
  hash.set(obj,cloneObj)
  for(let key in obj){
    if(obj.hasOwnProperty(key)){
      cloneObj[key] = deepClone(obj[key],hash)
    }
  }
  return cloneObj
}

const deepClone2 = (obj:any, hash = new WeakMap()) => {
  if(obj === null || typeof obj !== 'object') return obj
  if(obj instanceof Date) return new Date(obj)
  if(obj instanceof RegExp) return new RegExp(obj)
  if(hash.get(obj)) return hash.get(obj)
  let deepObj = new obj.constructor()
  hash.set(obj,deepObj)
  for(let key in obj){
    if(obj.hasOwnProperty(key)){
      deepObj[key] = deepClone2(obj[key],hash)
    }
  }
  return deepObj
}