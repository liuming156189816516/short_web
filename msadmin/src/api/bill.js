import request from '@/utils/request'

/*** 账单列表*/
export const getbilldetailstasklist = (params)=> {
  return request({url:'/billdetails/getbilldetailstasklist',method:'post',data:params})
}
export const dobilldetails = (params)=> {
  return request({url:'/billdetails/dobilldetails',method:'post',data:params})
}
export const getuseramount = (params)=> {
  return request({url:'/billdetails/getuseramount',method:'post',data:params})
}