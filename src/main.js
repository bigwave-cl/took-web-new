import Vue from 'vue'
import App from './App'
import router from './router'
import ASKComponents from './components/ask';
import './utils/wxbutton.js';
import './router/router.auth.js';
import VeeValidate from 'vee-validate'
import { WeiXin } from '@/services';
;(async (win)=>{
	const weixinServer = new WeiXin();
	await weixinServer.getSign(win.location.href.split('#')[0]).then(r => {
		win.wx.config({
		    debug: false,
		    appId: r.data.appId,
		    timestamp:  r.data.timestamp,
		    nonceStr: r.data.nonceStr,
		    signature: r.data.signature,
		    jsApiList: [
		      'checkJsApi',
		      'onMenuShareTimeline',
		      'onMenuShareAppMessage',
		      'onMenuShareQQ',
		      'onMenuShareWeibo',
		      'onMenuShareQZone',
		      'hideMenuItems',
		      'showMenuItems',
		      'hideAllNonBaseMenuItem',
		      'showAllNonBaseMenuItem',
		      'translateVoice',
		      'startRecord',
		      'stopRecord',
		      'onVoiceRecordEnd',
		      'playVoice',
		      'onVoicePlayEnd',
		      'pauseVoice',
		      'stopVoice',
		      'uploadVoice',
		      'downloadVoice',
		      'chooseImage',
		      'previewImage',
		      'uploadImage',
		      'downloadImage',
		      'getNetworkType',
		      'openLocation',
		      'getLocation',
		      'hideOptionMenu',
		      'showOptionMenu',
		      'closeWindow',
		      'scanQRCode',
		      'chooseWXPay',
		      'openProductSpecificView',
		      'addCard',
		      'chooseCard',
		      'openCard'
		    ]
		});
		win.wx.ready(()=>{
			Vue.prototype.$wx = win.wx;
		});
		win.wx.error((error)=>{
			alert(JSON.stringify(error.errMsg));
		});
		
	}, error => {
		console.log(error);
	})
	Vue.config.productionTip = false;
	Vue.use(ASKComponents);
	Vue.use(VeeValidate)
	new Vue({
		el: '#app',
		router,
		template: '<App/>',
		components: { App }
	})
})(window);
