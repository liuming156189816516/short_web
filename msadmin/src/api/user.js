import request from '@/utils/request'

/*** 用户管理*/
export const getappuserlist = (params)=> {
  return request({url:'/adminmember/getappuserlist',method:'post',data:params})
}
export const gettaskrecordlist = (params)=> {
  return request({url:'/record/gettaskrecordlist',method:'post',data:params})
}
export const getbillrecordlist = (params)=> {
  return request({url:'/record/getbillrecordlist',method:'post',data:params})
}
export const getstatislist = (params)=> {
  return request({url:'/statis/getstatislist',method:'post',data:params})
}
export const gettodaystatisinfo = (params)=> {
  return request({url:'/statis/gettodaystatisinfo',method:'post',data:params})
}
export const gettaskconfiginfo = (params)=> {
  return request({url:'/taskconfig/gettaskconfiginfo',method:'post',data:params})
}
export const dotaskconfiginfo = (params)=> {
  return request({url:'/taskconfig/dotaskconfiginfo',method:'post',data:params})
}
export const getmarketgrouplist = (params)=> {
  return request({url:'/taskconfig/getmarketgrouplist',method:'post',data:params})
}
export const getuserstatis = (params)=> {
  return request({url:'/adminmember/getuserstatis',method:'post',data:params})
}
export const getpixellidlist = (params)=> {
  return request({url:'/statis/getpixellidlist',method:'post',data:params})
}
export const blacklist = (params)=> {
  return request({url:'/adminmember/blacklist',method:'post',data:params})
}
export const getlotteryrecordlist = (params)=> {
  return request({url:'/record/getlotteryrecordlist',method:'post',data:params})
}








