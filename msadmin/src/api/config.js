/*** 通用配置*/
import request from '@/utils/request'

export const getchannellist = (params)=> {
  return request({url:'/channel/getchannellist',method:'post',data:params})
}
export const dochannel = (params)=> {
  return request({url:'/channel/dochannel',method:'post',data:params})
}