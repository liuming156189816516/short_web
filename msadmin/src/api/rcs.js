/*** 通用配置*/
import request from '@/utils/request'

export const getsmstasklist = (params)=> {
  return request({url:'/rcs/getrcstasklist',method:'post',data:params})
}
export const createsmstask = (params)=> {
  return request({url:'/rcs/creatercstask',method:'post',data:params})
}
export const checkfile = (params)=> {
  return request({url:'/rcs/checkfile',method:'post',data:params})
}
export const getsmstaskinfolist = (params)=> {
  return request({url:'/rcs/getrcstaskinfolist',method:'post',data:params})
}
export const delsmstasklist = (params)=> {
  return request({url:'/rcs/delrcstasklist',method:'post',data:params})
}
export const getsmstalklist = (params)=> {
  return request({url:'/rcs/getrcstalklist',method:'post',data:params})
}
export const dosmstalk = (params)=> {
  return request({url:'/rcs/dorcstalk',method:'post',data:params})
}
export const getcontentnum = (params)=> {
  return request({url:'/rcs/getcontentnum',method:'post',data:params})
}
export const exportsmstaskinfolist = (params)=> {
  return request({url:'/rcs/exportrcstaskinfolist',method:'post',data:params})
}


