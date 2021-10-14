import Vue from 'vue'
import VueRouter from 'vue-router'

const login = () => import('../views/login.vue')
const home = () => import('../views/home.vue')
const welcome = () => import('../views/welcome.vue')
const Users = () => import('../components/user/Users.vue')
const Rights = () => import('../components/power/Rights.vue')
const Roles = () => import('../components/power/Roles.vue')
const Report = () => import("../components/report/Report")
const Order = () => import("../components/order/Order")
const Cate = () => import("../components/goods/Cate.vue")
const Params = () => import("../components/goods/Params.vue")
const GoodsList = () => import("../components/goods/List.vue")
const GoodsAdd = () => import("../components/goods/list/Add.vue")
const GoodsEdit = () => import("../components/goods/list/Edit.vue")

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: welcome
    },
    {
      path: '/users',
      component: Users
    },
    {
      path: '/rights',
      component: Rights
    },
    {
      path: '/roles',
      component: Roles
    },
    {
      path: '/reports',
      component: Report
    },
    {
      path: '/orders',
      component: Order
    },
    {
      path: '/categories',
      component: Cate
    },
    {
      path: '/params',
      component: Params
    },
    {
      path: '/goods',
      component: GoodsList
    },
    {
      path: '/goods/add',
      component: GoodsAdd
    },
    {
      path: '/goods/edit/:id',
      component: GoodsEdit
    }]
  }

]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
	// to将要访问的路径
	// from代表从哪个路径跳转而来
	// next是一个函数，表示放行
	// next()放行  next('/login')强制跳转
	if (to.path === '/login') return next()
	//获取token
	const tokenStr = window.sessionStorage.getItem('token')
	if (!tokenStr) return next("/login")
	next()
})

export default router
