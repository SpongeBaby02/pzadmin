import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import PanelHead from './components/panelHead.vue'


//刷新后的动态路由添加 
const localData = localStorage.getItem('pz_token')
if(localData){
  console.log('刷222',store.state.menu.routerList)
  store.commit('dynamicMenu', store.state.menu.routerList)
  store.state.menu.routerList.forEach(item => {
    router.addRoute('main',item)
  })
}
router.beforeEach((to, from) => {
  const token = localStorage.getItem('pz_token')
  //非登录页面token不存在     ======    没有注册保存过的账号和密码进入了后台，跳回登录页面
  if (!token && to.path !== '/login'){
    return '/login'
  }else if(token && to.path === '/login'){  //token存在，但是进入登录页面，跳回后台首页
    return '/'
  }else {
    return true
  }
})

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('PanelHead', PanelHead)

//路由挂载
app.use(router)
//store挂载
app.use(store)
app.mount('#app')