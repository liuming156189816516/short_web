/*** 数据统计*/
import request from '@/utils/request'

export const getstatislist = (params)=> {
  return request({url:'/statis/getstatislist',method:'post',data:params})
}
export const gettodaystatisinfo = (params)=> {
  return request({url:'/statis/gettodaystatisinfo',method:'post',data:params})
}

export const gettodaysmstotalstatislist = (params)=> {
  return request({url:'/statis/gettodaysmstotalstatislist',method:'post',data:params})
}

export const getsmstotalstatislist = (params)=> {
  return request({url:'/statis/getsmstotalstatislist',method:'post',data:params})
}

export const gettodayrcstotalstatislist = (params)=> {
  return request({url:'/statis/gettodayrcstotalstatislist',method:'post',data:params})
}
export const getrcstotalstatislist = (params)=> {
  return request({url:'/statis/getrcstotalstatislist',method:'post',data:params})
}

export const exportsms = (params)=> {
  return request({url:'/statis/exportsms',method:'post',data:params})
}

export const exportrcs = (params)=> {
  return request({url:'/statis/exportrcs',method:'post',data:params})
}

