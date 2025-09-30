export const getType = (obj : any) => {
  let type = typeof obj;
  if(type !== "object") return type;
  
  const objType = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();

  return objType;
}