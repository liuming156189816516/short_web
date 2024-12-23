/*** 数据统计*/
import request from '@/utils/request'

export const getstatislist = (params)=> {
  return request({url:'/statis/getstatislist',method:'post',data:params})
}
export const gettodaystatisinfo = (params)=> {
    return request({url:'/statis/gettodaystatisinfo',method:'post',data:params})
  }
