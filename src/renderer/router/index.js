import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ChooseFolder',
      component: require('@/views/ChooseFolder').default
    },
    {
      path: '/select-photos',
      name: 'selectPhotos',
      component: require('@/views/SelectPhotos').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
