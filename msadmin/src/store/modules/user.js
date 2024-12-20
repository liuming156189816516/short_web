import { asyncRoutes, constantRoutes } from '@/router'
import { getchannellist } from "@/api/config"
import { login, loginout } from '@/api/login'
import { setToken,getToken,setUserInfo,getUserInfo,removeToken,getChannel,setChannel,removeChannel,removeGoodName } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  roles: [],
  routes: [],
  goodList:getChannel(),
  addRoutes: [],
  token: getToken(),
  userInfo: getUserInfo(),
  introduction: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_GOODS: (state, list) => {
    state.goodList = list
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password,seatName } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: username.trim(), pwd: password,account_type: seatName }).then(res => {
        if (res.code == 0) {
          commit('SET_TOKEN', res.data.token)
          commit('SET_USER_INFO', res.data.user_info)
          setToken(res.data.token)
          setUserInfo(res.data.user_info)
          return resolve(true)
        }
        resolve(false)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  async getMenuInfo({ commit, state, dispatch }) {
    resetRouter()
    let accessRoutes = [];
    if (state.userInfo.account_type == 3) {
      let staffMenu = asyncRoutes.filter(item =>{return item.path == '/staff'});
      accessRoutes= constantRoutes.concat(staffMenu);
    }else{
      accessRoutes = await dispatch('permission/generateRoutes',state.userInfo.account, { root: true })
    }
    router.addRoutes(accessRoutes)
  },

  initGoodsList({ commit }) {
    return new Promise((resolve, reject) => {
      getchannellist().then(res => {
        if (res.code == 0) {
          let list = res.data.list;
          if(list.length > 0){
            commit('SET_GOODS', list)
            setChannel(list);
          }
          return resolve(true)
        }
        resolve(false)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      loginout({}).then(res => {
        if(res.code != 0) return;
        resetRouter()
        removeToken()
        removeChannel()
        removeGoodName()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
