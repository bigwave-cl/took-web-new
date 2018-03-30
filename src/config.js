let config = {
	isLocal: false,
	el: document.getElementsByTagName('body')[0],
	getBaseUrl() {
		let _r = this.el.getAttribute('data-api');
		if (this.isLocal) {
			// _r = 'http://qft.jiaohang999.com/qft/page/web-app/api';
			// _r = 'http://192.168.1.100:8045/api';
			_r = 'http://testmob.to-ok.com.cn/page/web-app/api';
			// _r = 'http://test.xiuzhimeng.com/fqb/page/web-app/api';
			// _r = 'http://qft.jiaohang999.com/qft/page/web-app/api';
		}
		return _r;
	},
	getUpUrl() {
		let _r = this.el.getAttribute('data-file-api');
		if (this.isLocal) {
			_r = 'http://testmob.to-ok.com.cn/api';
		}
		return _r;
	},
	getAuthToken() {
		let _r = this.el.getAttribute('data-token');
		if (this.isLocal) {
			// _r = '1a6d0c9bf64054e48cfdf3b28cb62bb8';
			_r = '37a7c0f5cd05818c4af9e5a01fe56873';
		}
		return _r;
	},
	getCsrfToken() {
		let _r = this.el.getAttribute('data-csrfToken');
		if (this.isLocal) {
			_r = 'csrf';
		}
		return _r;
	},
	getWId() {
		let _r = this.el.getAttribute('data-wid');
		if (this.isLocal) {
			// _r = 1;
			_r = 164;
		}
		return _r;
	}
}

export const PROD = config.isLocal;
export const BASE_URL = config.getBaseUrl();
export const UP_URL = config.getUpUrl();
export const AUTH_TOKEN = config.getAuthToken();
export const W_ID = config.getWId();
export const CSRF = config.getCsrfToken();