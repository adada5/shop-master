import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'
import welcome from '../views/welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Report from "../components/report/Report"
import Order from "../components/order/Order"
import Cate from "../components/goods/Cate.vue";
import Params from "../components/goods/Params.vue";
import GoodsList from "../components/goods/List.vue";
import GoodsAdd from "../components/goods/list/Add.vue";
import GoodsEdit from "../components/goods/list/Edit.vue";


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
