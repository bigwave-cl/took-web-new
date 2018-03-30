import {
	ajax,
	askDialogToast,
	sessionStorage,
	askDialogAlert
} from '@/utils';

import * as config from '@/config.js';

const baseURL = config.BASE_URL;
const upFileURL = config.UP_URL;

export class WeiXin{
	getSign(cur_url){
		// let url = "http://192.168.1.100:3033/api/getWechat";
		let url = baseURL;
		let option = {
			"method": "wx2_jssdk",
			"current_url": cur_url
		}
		return this._ajax('post',url,option);
	}
	sendMessage(seconds,serverId){
		let url = baseURL;
		let option = {
			"method": "chat_wxVoice",
			"media_id": serverId,
			"seconds": seconds
		}
		return this._ajax('post',url,option);
	}
	_ajax(method,url, options) {
		options = options || {};
		return ajax({
			method: method,
			url: url,
			data: options,
			complete: (r) => {
				if (r.error) {
					askDialogToast({ msg: '网络请求失败', time: 2000, class: 'danger' });
					return;
				}
				if (!r.data.ok) {
					askDialogToast({ msg: r.data.error ? r.data.error : '接口请求失败', time: 2000 , class: 'danger'});
					return;
				}
			}
		});
	}
}
export class Lottery {
	constructor() {
		this.lotId = null;
	}

	home() {
		const homeServer = this._ajax('post', { "method": "lottery_home" });
		if (this.lotId == null) {
			homeServer.then(r => {
				this.lotId = r.data.lot && r.data.lot.lot_id;
			})
		}
		return homeServer;
	}
	async getLuckNumber() {
		if (this.lotId == null) {
			await this.home();
		}
		return this._ajax('post', { "lot_id": this.lotId, "method": "lottery_getLuckyNum" });
	}

	async notice() {
		if (this.lotId == null) {
			await this.home();
		}
		return this._ajax('post', { "lot_id": this.lotId, "method": "lottery_marquee" });
	}
	async code() {
		if (this.lotId == null) {
			await this.home();
		}
		return this._ajax('post', { "lot_id": this.lotId, "method": "lottery_getCode" });
	}
	async detail() {
		if (this.lotId == null) {
			await this.home();
		}
		return this._ajax('post', { "lot_id": this.lotId, "method": "lottery_prizeDetail" });
	}

	goods(offset) {
		return this._ajax('post', { "offset": offset, "method": "lottery_goodsList" });
	}
	_ajax(method, options) {
		options = options || {};
		return ajax({
			method: method,
			url: baseURL,
			data: options,
			before: (r) => {},
			complete: (r) => {
				if (r.error) {
					askDialogToast({ msg: "网络请求失败", time: 2000, class: 'danger' });
					return;
				}
				if (!r.data.ok) {
					askDialogToast({ msg: r.data.error ? r.data.error : '接口请求失败', time: 2000, class: 'danger' });
					return;
				}
			}
		});
	}
}

export class Chat {
	info(){
		let option = {
			"method": "chat_info"
		}
		return this._ajax('post', option);
	}
	message(options) {
		let option = {
			"new_id": options && options.new_id || 0, //默认0,最新一条数据的id   
			"old_id": options && options.old_id || 0, //默认0,最后一条数据的id   
			"type": 1, //1获取新的,2获取旧的
			"method": "chat_msgList"
		}
		return this._ajax('post', option);
	}
	oldMessage(options) {
		let option = {
			"new_id": options.new_id || 0, //默认0,最新一条数据的id   
			"old_id": options.old_id || 0, //默认0,最后一条数据的id   
			"type": 2, //1获取新的,2获取旧的
			"method": "chat_msgList"
		}
		return this._ajax('post', option);
	}
	sendMessage(msg) {
		let option = {
			"msg": msg,
			"method": "chat_sendMsg"
		}
		return this._ajax('post', option);
	}
	amrToMp3(url) {
		let option = {
			"url": url,
			"method": "chat_amrToMp3"
		}
		return this._ajax('post', option);
	}
	updateFile(option) {
		return ajax({
			method: 'post',
			url: `${upFileURL}/user_upFile`,
			data: option,
			headers: 'formData',
			before: (r) => {},
			complete: (r) => {
				if (r.error) {
					askDialogToast({ msg: '网络请求失败', time: 2000, class: 'danger' });
					return;
				}
				if (!r.data.ok) {
					askDialogToast({ msg: r.data.error ? r.data.error : '接口请求失败', time: 2000 , class: 'danger'});
					return;
				}
			}
		});
	}
	_ajax(method, options) {
		options = options || {};
		return ajax({
			method: method,
			url: baseURL,
			data: options,
			before: (r) => {},
			complete: (r) => {
				if (r.error) {
					askDialogToast({ msg: '网络请求失败', time: 2000, class: 'danger' });
					return;
				}
				if (!r.data.ok) {
					askDialogToast({ msg: r.data.error ? r.data.error : '接口请求失败', time: 2000 , class: 'danger'});
					return;
				}
			}
		});
	}
}
