import router from './index.js'
import { refreshTitle } from '@/utils';

router.beforeEach((to, from, next) => {
	if (to.name == 'index' || to.name == 'demo') {
		document.body.classList.add('lottery');
	} else {
		document.body.classList.remove('lottery');
	}
	
	if(to.meta.title){
		refreshTitle(to.meta.title);
	}else{
		refreshTitle('兑奖中心');
	}
	next();
	/*to.matched.some(record => {
		next()
	});*/
})
