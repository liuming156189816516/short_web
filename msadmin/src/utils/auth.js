import Cookies from 'js-cookie'

const UserInfo = 'Admin'
const TokenKey = 'Admin-Token'
const channelName = 'Channel'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getUserInfo() {
  return Cookies.get(UserInfo)?JSON.parse(Cookies.get(UserInfo)):"";
}

export function setUserInfo(info) {
  return Cookies.set(UserInfo, info)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


export function getGoodName() {
  return Cookies.get(channelName)?JSON.parse(Cookies.get(channelName)):"";
}

export function setGoodName(data) {
  return Cookies.set(channelName,JSON.stringify(data))
}
export function removeGoodName() {
  return Cookies.remove(channelName)
}

export function getChannel() {
  return JSON.parse(localStorage.getItem("channel"))
}

export function setChannel(list) {
  return localStorage.setItem("channel",JSON.stringify(list))
}

export function removeChannel() {
  return localStorage.removeItem("channel")
}

export function getTimeZone() {
  return localStorage.getItem("timeZone")||"Asia/Shanghai";
}

export function setTimeZone(val) {
  return localStorage.setItem("timeZone",val);
}
