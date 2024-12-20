/*** 通用配置*/
import request from '@/utils/request'

export const getchannellist = (params)=> {
  return request({url:'/channel/getchannellist',method:'post',data:params})
}
export const dochannel = (params)=> {
  return request({url:'/channel/dochannel',method:'post',data:params})
}
export const getsmstasklist = (params)=> {
  return request({url:'/sms/getsmstasklist',method:'post',data:params})
}
export const createsmstask = (params)=> {
  return request({url:'/sms/createsmstask',method:'post',data:params})
}
export const checkfile = (params)=> {
  return request({url:'/sms/checkfile',method:'post',data:params})
}
export const getsmstaskinfolist = (params)=> {
  return request({url:'/sms/getsmstaskinfolist',method:'post',data:params})
}
export const delsmstasklist = (params)=> {
  return request({url:'/sms/delsmstasklist',method:'post',data:params})
}
export const changechannel = (params)=> {
  return request({url:'/channel/changechannel',method:'post',data:params})
}
export const getuidchannel = (params)=> {
  return request({url:'/channel/getuidchannel',method:'post',data:params})
}
export const getsmstalklist = (params)=> {
  return request({url:'/sms/getsmstalklist',method:'post',data:params})
}
export const dosmstalk = (params)=> {
  return request({url:'/sms/dosmstalk',method:'post',data:params})
}



