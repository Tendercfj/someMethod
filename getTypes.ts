/**
 * 获取详细的数据类型
 * @params x
 * @returns string
 */

const getTypes = (x: any): string => {
  const originType = Object.prototype.toString.call(x)
  const spaceIndex = originType.indexOf(' ')
  const type = originType.slice(spaceIndex + 1, -1)
  return type
}