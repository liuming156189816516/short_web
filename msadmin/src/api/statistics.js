/*** 数据统计*/
import request from '@/utils/request'

export const getstatislist = (params)=> {
  return request({url:'/statis/getsmstotalstatislist',method:'post',data:params})
}
export const gettodaystatisinfo = (params)=> {
    return request({url:'/statis/gettodaysmstotalstatislist',method:'post',data:params})
  }
