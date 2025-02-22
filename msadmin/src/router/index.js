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
    meta: { title:i18n.t('sys_s022'),icon: 'el-icon-s-data' },
    children: [
      {
        path: '/short-list',
        component: () => import('@/views/shortMessage/short-list'),
        name: 'short-list',
        meta: {
          title:i18n.t('sys_s024'),
        }
      },
      {
        hidden: true,
        path: '/creat-mess',
        component: () => import('@/views/shortMessage/creat-mess'),
        name: 'creat-mess',
        meta: {
          title:i18n.t('sys_m114'),
        }
      },
      {
        hidden: true,
        path: '/task-tetail',
        component: () => import('@/views/shortMessage/task-tetail'),
        name: 'task-tetail',
        meta: {
          title:i18n.t('sys_m063'),
        }
      },
      {
        path: '/ms-statistics',
        component: () => import('@/views/shortMessage/ms-statistics'),
        name: 'ms-statistics',
        meta: {
          title:i18n.t('sys_s007'),
        }
      }
    ]
  },
  {
    path: '/rcsMessage',
    component: Layout,
    name: 'rcsMessage',
    meta: { title:i18n.t('sys_r001'),icon: 'el-icon-s-data' },
    children: [
      {
        path: '/rcs-list',
        component: () => import('@/views/rcsMessage/rcs-list'),
        name: 'rcs-list',
        meta: {
          title:i18n.t('sys_r002'),
        }
      },
      {
        hidden: true,
        path: '/creat-rcs',
        component: () => import('@/views/rcsMessage/creat-rcs'),
        name: 'creat-rcs',
        meta: {
          title:i18n.t('sys_r005'),
        }
      },
      {
        hidden: true,
        path: '/rcs-tetail',
        component: () => import('@/views/rcsMessage/rcs-tetail'),
        name: 'rcs-tetail',
        meta: {
          title:i18n.t('sys_r003'),
        }
      },
      {
        path: '/rcs-statistics',
        component: () => import('@/views/rcsMessage/rcs-statistics'),
        name: 'rcs-statistics',
        meta: {
          title:i18n.t('sys_r004'),
        }
      },
      {
        path: '/task-statistics',
        component: () => import('@/views/rcsMessage/task-statistics'),
        name: 'task-statistics',
        meta: {
          title:i18n.t('sys_r006'),
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
    path: '/dataSummary',
    component: Layout,
    name: 'dataSummary',
    meta: { title:"",icon: 'el-icon-folder-opened'},
    children: [
      {
        path: '/smssummary',
        component: () => import('@/views/dataSummary/sms-summary'),
        name: 'smssummary',
        meta: {
          title: i18n.t('sys_m046'),
        }
      },
      {
        path: '/rcssummary',
        component: () => import('@/views/dataSummary/rcs-summary'),
        name: 'rcs1summary',
        meta: {
          title: i18n.t('sys_r016')
        }
      }
    ]
  },
  {
    path: '/billManage',
    component: Layout,
    name: 'billManage',
    meta: { title:i18n.t('sys_s047'),icon: 'el-icon-s-data' },
    children: [
      {
        path: '/bill-detail',
        component: () => import('@/views/billManage/billDetail'),
        name: 'bill-detail',
        meta: {
          title:i18n.t('sys_m064'),
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
      },
      {
        hidden: true,
        path: '/user_bill',
        component: () => import('@/views/permission/user_bill'),
        name: 'user_bill',
        meta: {
          title: i18n.t('sys_m064')
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
