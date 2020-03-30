import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ImDemo from "../components/ImDemo";
import WebSocketDemo from "../components/WebSocketDemo";
import DemoList from "../components/DemoList";

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/demo',
      name: 'demoList',
      component: {
        default: DemoList,
        webSocketDemo:WebSocketDemo,
        imDemo:ImDemo,
        hello:HelloWorld,
      }
    },
    {
      path: '/hello',
      name: 'hello',
      component: HelloWorld
    },
    {
      path:'/im',
      name:'im',
      component:ImDemo
    },
    {
      path:'/webSocket',
      name:'webSocket',
      component:WebSocketDemo
    }
  ]
})
