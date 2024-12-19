import Vue from 'vue'
import i18n from '@/locale'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'

/* Router Modules */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/dashboard/index'),
        name: 'index',
        meta: { title:i18n.t('sys_m016'), icon: 'el-icon-odometer', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        hidden: true,
        path: '/change-password',
        component: () => import('@/views/user/change-password'),
        name: 'change-password',
        meta: {
          title:i18n.t('sys_m021')
        }
      }
    ]
  }
]
export let asyncRoutes = [
  {
    path: '/data',
    component: Layout,
    name: 'data',
    meta: { title:i18n.t('sys_m041'),icon: 'el-icon-s-data' },
    children: [
      {
        path: '/wa-list',
        component: () => import('@/views/data/wa-list'),
        name: 'wa-list',
        meta: {
          title:i18n.t('sys_m042'),
        }
      }
    ]
  },
  {
    path: '/shortMessage',
    component: Layout,
    name: 'shortMessage',
    meta: { title:i18n.t('sys_m041'),icon: 'el-icon-s-data' },
    children: [
      {
        path: '/short-list',
        component: () => import('@/views/shortMessage/short-list'),
        name: 'short-list',
        meta: {
          title:i18n.t('sys_m042'),
        }
      },
      {
        hidden: true,
        path: '/creat-mess',
        component: () => import('@/views/shortMessage/creat-mess'),
        name: 'creat-mess',
        meta: {
          title:i18n.t('sys_m042'),
        }
      }
    ]
  },
  {
    path: '/content',
    component: Layout,
    name: 'content',
    meta: { title: i18n.t('sys_m045'),icon: 'el-icon-folder-opened'},
    children: [
      {
        path: '/material',
        component: () => import('@/views/content/material'),
        name: 'material',
        meta: {
          title: i18n.t('sys_m046'),
        }
      },
      {
        hidden: true,
        path: '/add',
        component: () => import('@/views/content/add'),
        name: 'add',
        meta: {
          title: i18n.t('sys_m048')
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    name: 'permission',
    meta: {
      title: i18n.t('sys_m049'),
      icon: 'lock',
    },
    children: [
      {
        path: '/userManage',
        component: () => import('@/views/permission/userManage'),
        name: 'userManage',
        meta: {
          title: i18n.t('sys_m050'),
        }
      },
      {
        path: '/roleManage',
        component: () => import('@/views/permission/roleManage'),
        name: 'roleManage',
        meta: {
          title: i18n.t('sys_m051'),
        }
      },
      {
        path: '/menuManage',
        component: () => import('@/views/permission/menuManage'),
        name: 'menuManage',
        meta: {
          title: i18n.t('sys_m052')
        }
      },
      {
        path: '/baseConfig',
        component: () => import('@/views/permission/baseConfig'),
        name: 'baseConfig',
        meta: {
          title: i18n.t('sys_l118')
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
