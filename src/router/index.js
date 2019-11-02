import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用插件富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 分模块打包
const Login = () => import(/* webpackChunkName: 'index' */'../components/Login.vue')
const Index = () => import(/* webpackChunkName: 'index' */'../components/Index.vue')

const Users = () => import(/* webpackChunkName: users' */'../components/users/Users.vue')

const Roles = () => import(/* webpackChunkName: rights' */'../components/rights/Roles.vue')
const Rights = () => import(/* webpackChunkName: rights' */'../components/rights/Rights.vue')

const Goods = () => import(/* webpackChunkName: products' */'../components/product/Goods.vue')
const Categories = () => import(/* webpackChunkName: products' */'../components/product/Categories.vue')
const Params = () => import(/* webpackChunkName: products' */'../components/product/Params.vue')
const GoodsAdd = () => import(/* webpackChunkName: products' */'../components/product/GoodsAdd.vue')

Vue.use(VueQuillEditor /* { default global options } */)

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index',
    component: Index,
    children: [
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/goods', component: Goods },
      { path: '/params', component: Params },
      { path: '/categories', component: Categories },
      { path: '/goods-add', component: GoodsAdd }
    ]
  },
  { path: '/login', component: Login }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // console.log(to)
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
