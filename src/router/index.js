import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index/index'
import demo from '@/views/demo/demo'
import LOTTERY_ROUTERS from './lottery.js';

const APP_ROUTERS = [{
		path: '/',
		name: 'index',
		component: index
	}, {
		path: '/demo',
		name: 'demo',
		component: demo,
		meta: { title: 'demo' }
	},
	LOTTERY_ROUTERS
];

Vue.use(Router)
export default new Router({
	// mode: 'history',
	routes: APP_ROUTERS
})
