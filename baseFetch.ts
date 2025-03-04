const baseUrl = "xxx"
const testUrl = "aaa"
// const localUrl = "http://localhost:3000" //端口号自定义

const getBaseUrl = () => {
  const isStaging = window.location.href.startsWith('')
  const isDev = window.location.href.startsWith('http://localhost')
  if(isStaging) return testUrl
  if(isDev) return testUrl
  return baseUrl
}

export const baseFetch = async (path:string, params:object) => {
  return fetch(`${getBaseUrl()}${path}`,params)
}

export const jsonFetch = async (path:string, params:any = {}, retry = 0) => {
  const headers = {
    ...(params?.headers || {}),
    Authorization: localStorage.getItem('token'),
  }
  if (!(params.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'; // 默认为json格式，如果是上传文件的格式，浏览器会自动添加'Content-Type'值为'multipart/form-data'
  }
  const json = await baseFetch(path,{
    ...params,
    headers,
  })
  const data = await json.json()
  if((data.code === 401 || data.code === 403) && retry === 0){
    console.log('token失效，重新登录')
    const tokenData = await refreshToken()
    if(tokenData.token){
      localStorage.setItem('token', tokenData.token)
      return jsonFetch(path, params, retry + 1) //retry + 1 递归调用
    }else{
      // token失效，重新登录失败
      const {code,message} = tokenData
      return {code,message}
    }
  }
  return data
}

const refreshToken = async () => {
  // 刷新token的后端方法
  const json = await fetch(`${getBaseUrl()}/refreshToken`,{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}` // token
    }
  })
  const data = await json.json()
  return data
}

export const jsonFetchWithouthToken = async (path:string, params:any = {}) => {
  const json = await baseFetch(path,{
    ...params,
    headers:{
      'Content-Type': 'application/json',
      ...params(params.headers || {}), // 合并headers
    }
  })
  return json.json()
}

// 用法示例
/**
 * 
 * export const fetchMember = async (params: QueryMemberParams) => {
  return jsonFetch('/admin/wxuser/list', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
 * 
 */