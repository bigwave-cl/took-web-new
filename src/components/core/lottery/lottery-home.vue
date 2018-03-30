<style src="./lottery-home.scss" lang="scss"></style>
<template>
	<div class="ask-lottery-home">
		<!-- <div>state->{{log}}</div> -->
		<template v-if="luck == null">
			<div class="lottery-home-box is-null">
				<div class="is-null-text" v-if="isnull">
					敬请期待商家开奖
				</div>
			</div>
		</template>
		<template v-else>
			<div class="lottery-home-box">
				<div class="ver-box">
					<div class="an-box">
						<!-- <ask-lottery-animation 
							class="lottery-home" 
							:stop="lotteryStop" 
							:lottery="lotteryOpen" 
							:codes="lotteryCodes" 
							@callback="lotteryAnimationEnd">
						</ask-lottery-animation> -->
						<ask-lottery-animation 
							class="lottery-home" 
							:lottery="lotteryOpen" 
							:codes="lotteryCodes" 
							@callback="lotteryAnimationEnd">
						</ask-lottery-animation>
					</div>
					<div class="info">
						<before-lottery 
							:luck="luck" 
							:show=" luck && luck.state == lotteryRef.BEFORE || 
									luck && luck.state == lotteryRef.RECEIVE ||
									luck && luck.state == lotteryRef.RECEIVEING">
						</before-lottery>
						<draw-lottery :luck="luck" :currentPrize="currentPrize" :show="luck && luck.state == lotteryRef.UNDERWAY">
						</draw-lottery>
						<after-lottery :luck="luck" :show="luck && luck.state == lotteryRef.FINISH"></after-lottery>
					</div>
				</div>
				<div class="col-box">
					<div class="chance" v-if="luck && luck.state != lotteryRef.UNDERWAY && luck.state != lotteryRef.FINISH">
						您共有兑奖机会
						<em>{{ luck && luck.times || 0 }}</em>次
						<ask-button @ask-click="freeRule">
							<i class="iconfont icon-help"></i>
						</ask-button>
					</div>
					<winning-codes 
						:show="luck && luck.state == lotteryRef.UNDERWAY" 
						:currentPrize="currentPrize" 
						:codes="winningCodes">
					</winning-codes>
					<div class="chance" v-if="luck && luck.state == lotteryRef.FINISH">
						已结束，等待下次开奖
					</div>
				</div>
			</div>
			<rolling-notice :list="notices"></rolling-notice>
		</template>
	</div>
</template>
<script>
import { sessionStorage, askDialogToast } from '@/utils';
import moment from 'moment/moment.js';
import lotteryPopup from './lottery-popup.js';
import { Lottery } from '@/services';

import beforeLottery from './before-lottery.vue';
import afterLottery from './after-lottery.vue';
import drawLottery from './draw-lottery.vue';
import winningCodes from './winning-codes.vue';
import rollingNotice from '@core/rolling-notice/rolling-notice.vue';

let RECIPROCAL_END_TIMER = null;
let DORMANCY_TIMER = null,
	DORMANCY_LAST_TIME = null; //休眠时间
export default {
	name: "lottery-home",
	components: {
		"before-lottery": beforeLottery,
		"after-lottery": afterLottery,
		"draw-lottery": drawLottery,
		"winning-codes": winningCodes,
		'rolling-notice':rollingNotice
	},
	mixins: [lotteryPopup],
	inject: ['rootMain'],
	provide() {
		return {
			lotteryMain: this
		}
	},
	computed: {
		winningCodes() {
			let wc = [];
			if (this.currentPrize && this.currentPrize.codes != "") {
				let codes = this.currentPrize.codes.split(/[,]/);
				if(this.currentPrize.lev == 1){
					wc = [codes[0]];
				}else{
					wc = codes;
				}
			}
			return wc;
		}
	},
	data() {
		return {
			lotteryCodes:'0000',
			luck: null,
			isnull: false,
			difference: 0,
			currentPrize: null,
			lotteryOpen: [1, 1, 1, 1],
			lotteryStop: true,
			lotteryRef: {
				BEFORE: 0, //活动未开始
				RECEIVE: 1, //开始领取兑奖号
				RECEIVEING: 2, //领取兑奖号
				UNDERWAY: 3, //活动进行中
				FINISH: 4, //活动已结束
			},
			lotteryServer: new Lottery(),
			notices:[],
			luckNumberDisabled: false,
			log: '',
		}
	},
	async created() {
		this.rootMain.loader(true)
		await this.initLottery();
		this.lotteryServer.notice().then(r=>{
			this.rootMain.loader(false);
			if(this.luck == null) return;
			this.notices = r.data.list.map((index,key)=>{
				let cur = {
					name: `通知${key+1}`,
					value: index.content
				}
				return cur;
			})
		},error=>{
			this.rootMain.loader(false);
		})

		DORMANCY_LAST_TIME = Date.now();
		DORMANCY_TIMER = setInterval(()=>{
		    if(Math.abs(Date.now() - DORMANCY_LAST_TIME) > 3000) {
		        this.initLottery();
		    }
		    DORMANCY_LAST_TIME = Date.now();
		}, 1000);
	},
	methods: {
		async initLottery() {
			await this.lotteryServer.home().then(r => {
				if(!r.data.ok){
					this.$parent.$el.classList.add('is-null');
					this.luck = null;
					this.isnull = true;
					this.log = 'first ok is false';
					return;
				}
				this.luckNumberDisabled = false;
				this.log = 'first ok is true';
				if(this.$parent.$el.classList.contains('is-null')){
					this.$parent.$el.classList.remove('is-null');
				}
				let luckNumber = sessionStorage.getItem('luck_number');
				this.luck = r.data.lot;
				this.luck.servertime = r.data.servertime;
				
				//设置侧滑栏链接
				this.rootMain.setSideUrl(r.data.lot.detail,r.data.lot.rule_url,r.data.lot.records);

				this.difference = this.luck.servertime - moment().unix();
				if (this.luck.state === this.lotteryRef.FINISH) {
					if (luckNumber) sessionStorage.removeItem('luck_number');
					return;
				}

				if (this.luck.state === this.lotteryRef.BEFORE) {
					if (luckNumber) sessionStorage.removeItem('luck_number');
					this.reciprocalEndRequest(this.luck.get_code_begin);
					return;
				}

				if (this.luck.state === this.lotteryRef.RECEIVE) {
					if (luckNumber) sessionStorage.removeItem('luck_number');
					this.reciprocalEndRequest(this.luck.get_code_end);
					return;
				}

				if (this.luck.state === this.lotteryRef.RECEIVEING) {
					if (luckNumber) sessionStorage.removeItem('luck_number');
					this.reciprocalEndRequest(this.luck.open_time);
					return;
				}

				if (this.luck.state === this.lotteryRef.UNDERWAY) {
					this.currentPrize = this.luck.prizes.filter(index => index.lev == this.luck.cur_prize_lev)[0];
					if (this.currentPrize.codes == '') {
						askDialogToast({ msg: "奖项已全部开启完毕！" });
						return; //"奖项已全部开启完毕";
					}

					if (this.luck.cur_prize_lev == 1) {
						this.lotteryOpen = this.luck.lucky_open.map(index => {
							return parseInt(index, 10);
						});
						this.openLastPrize();
						return;
					}
					this.winningOfNotice();
					this.reciprocalEndRequest(this.currentPrize && this.currentPrize.next_open_time);
					return;
				}
			},error=>{
					this.log = 'error null before';
				if(!this.$parent.$el.classList.contains('is-null')){
					this.log = 'error null after';
					this.$parent.$el.classList.add('is-null');
					this.luck = null;
				}
			});
		},
		openLastPrize() {
			if (this.currentPrize.lev != 1) return;
			let result = this.lotteryOpen.filter(index => index == 1);
			if (result.length === this.lotteryOpen.length){
				this.luckNumberDisabled = true;
				return;
			} 
			let timer = setTimeout(() => {
				clearTimeout(timer);
				this.initLottery();
			}, 5000);
		},
		lotteryAnimationEnd() {
			this.lotteryStop = true;
			if (this.currentPrize&&this.currentPrize.lev == 1) {
				this.winningOfNotice();
			}
		},
		//倒数结束请求接口
		reciprocalEndRequest(time) {
			let difference = this.timeDiffer(time);

			if (RECIPROCAL_END_TIMER) clearTimeout(RECIPROCAL_END_TIMER);
			if (parseInt(difference / 1000, 10) <= 0) {
				this.initLottery();
				return;
			};
			RECIPROCAL_END_TIMER = setTimeout(() => {
				this.reciprocalEndRequest(time);
			}, 1000);
		},
		//根据传递过来的time计算与当前时间的差值，毫秒
		timeDiffer(time) {
			let _time = time * 1000, //传过来的时间戳是从秒获取的，转换成毫秒
				curTime = Date.now() + this.difference * 1000;

			let delay = 3000;
			curTime -= delay;

			let difference = _time - curTime;
			return difference;
		}
	},
	watch:{
		currentPrize:{
			handler: function(n, o) {
				let lc = null;
				if (this.currentPrize && this.currentPrize.codes != "") {
					this.lotteryStop = false;
					let codes = this.currentPrize.codes.split(/[,]/);
					if(this.currentPrize.lev == 1){
						lc = codes[0];
					}else{
						if (codes.length > 1) {
							lc = codes[codes.length - 1] + '';
						} else {
							lc = codes[0];
						}
					}
				}
				this.lotteryCodes = lc;
			},
			deep: true
		}
	}
}

</script>
