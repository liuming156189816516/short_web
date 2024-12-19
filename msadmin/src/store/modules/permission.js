import { asyncRoutes, constantRoutes } from '@/router'
import { adminmenu } from '@/api/login'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []
//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })
//   return res
// }

// export function filterAsyncRoutes(asyncRouter,routers){
//   return asyncRouter.filter(item =>{
//     if (routers.includes(item.path)||item.hidden) {
//       if (item.children && item.children.length > 0) {
//         item.children = filterAsyncRoutes(item.children,routers)
//       }
//       return true
//     }
//   })
// }

export function filterAllMenu(menuList,router=[]){
  menuList.forEach(item =>{
    router.push(item.path);
    if (item.children && item.children.length > 0) {
      filterAllMenu(item.children,router);
    }
  })
  return router;
}

const state = {
  roles:"",
  userMenu:[],
  routes: []
}
export function filterAsyncRoutes(routers){
  return routers.filter(item =>{
    let childrenList = []
    for (let k = 0; k < asyncRoutes.length; k++) {
      if(item.path == asyncRoutes[k].path&&asyncRoutes[k].children.length>0){
        for (let c = 0; c < asyncRoutes[k].children.length; c++) {
          if(asyncRoutes[k].children[c].hidden){
            item.children.push(asyncRoutes[k].children[c])
          }
        }
      }
      if(asyncRoutes[k].children&&asyncRoutes[k].children.length>0){
        for (let l = 0; l < asyncRoutes[k].children.length; l++) {
          childrenList.push(asyncRoutes[k].children[l])
        }
      }

      if(asyncRoutes[k].path === item.path){
        item.name = asyncRoutes[k].meta.title;
        item.component = asyncRoutes[k].component;
      }
      
      if(childrenList&&childrenList.length>0){
        for (let f = 0; f < childrenList.length; f++) {
          if(item.path == childrenList[f].path){
            item.name = childrenList[f].meta.title;
            item.component = childrenList[f].component;
          }
        }
      }
    }
    if (item.path) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoutes(item.children)
      }
      return true
    }
  })
}
const mutations = {
  SET_ROUTES: (state, routes) => {
    let rolesRouter = filterAsyncRoutes(state.userMenu);
    const adminSys = asyncRoutes.filter(item=> item.path == "/permission");
    if(state.roles == "admin"){
      state.routes = [...constantRoutes,...rolesRouter,...adminSys]
    }else{
      state.routes = [...constantRoutes,...rolesRouter]
    }
  },
  SET_MENU: (state, menu) => {
    state.userMenu = menu
  },
  SET_ROLE: (state, role) => {
    state.roles = role
  }
}

const actions = {
  async generateRoutes({ state,commit }, roles) {
    let { data } = await adminmenu({});
    let userMenu = data.memu || [];
    return new Promise(resolve => {
      commit('SET_ROLE', roles)
      commit('SET_MENU', userMenu)
      let accessedRoutes = asyncRoutes || []
      commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
      resolve(state.routes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
