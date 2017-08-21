import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'
import Dashboard from './components/Dashboard.vue'
import Tasks from './components/Tasks.vue'
import Task from './components/Task.vue'
import Project from './components/Project.vue'
import store from './store'

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

import 'element-ui/lib/theme-default/index.css'

Vue.use(ElementUI, { locale })
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuex)

var router = new VueRouter({
  routes: [
    { 
      path: '/', 
      component: Dashboard
    }, {
      path: '/tasks',
      component: Tasks
    }
  ]})

const app = new Vue({
  router,
	store,
  render: h => h(App)
}).$mount('#app')



export default router
