<style src="./lottery-main.scss" lang="scss"></style>
<template>
	<div class="ask-lottery-main">
		<section>
			<before-lottery :luck="luck" :show="luck && luck.state != lotteryRef.FINISH && luck.state != lotteryRef.UNDERWAY">
				<lucky-list :luck="luck" slot="lucky-list"></Lucky-list>
			</before-lottery>

			<draw-lottery 
				:luck="luck" 
				:currentPrize="currentPrize"
				:show="luck && luck.state == lotteryRef.UNDERWAY">

				<ask-lottery-animation 
					class="lottery-home" 
					:lottery="lotteryOpen" 
					:codes="lotteryCodes" 
					@callback="lotteryAnimationEnd">
				</ask-lottery-animation>
				<h5>中奖号码:<span v-if="lotteryStop">{{ currentPrize && currentPrize.codes}}</span></h5>
			</draw-lottery>
			<after-lottery :luck="luck" :show="luck && luck.state == lotteryRef.FINISH"></after-lottery>

			<div class="space-box has-margin">
				<a :href="luck&&luck.records" class="ordinary-a" title="往期开奖记录">
					<ask-button class="ordinary-btn" :text="'往期开奖记录'"></ask-button>
				</a>
				
				<a :href="luck&&luck.rule_url" class="ordinary-a" title="兑奖规则">
					<ask-button class="ordinary-btn" :text="'兑奖规则'"></ask-button>
				</a>
			</div>
			<lottery-button :luck="luck" :lotteryRef="lotteryRef"></lottery-button>
		</section>
	</div>
</template>
<script>
import { sessionStorage, askDialogToast } from '@/utils';
import moment from 'moment/moment.js';
import lotteryPopup from '@core/lottery/lottery-popup.js';
import { Lottery } from '@/services';

import beforeLottery from './before-lottery.vue';
import afterLottery from './after-lottery.vue';
import drawLottery from './draw-lottery.vue';
import luckyList from './lucky-list.vue';
import lotteryButton from './lottery-button.vue';

let RECIPROCAL_END_TIMER = null;
let DORMANCY_TIMER = null,
	DORMANCY_LAST_TIME = null; //休眠时间
export default {
	name: "lottery-main",
	components: {
		"before-lottery": beforeLottery,
		"after-lottery": afterLottery,
		"draw-lottery": drawLottery,
		"lucky-list": luckyList,
		"lottery-button": lotteryButton,
	},
	mixins: [lotteryPopup],
	inject: ['rootMain'],
	provide() {
		return {
			lotteryMain: this
		}
	},
	data() {
		return {
			lotteryCodes:'0000',
			luck: null,
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
			lotteryServer: new Lottery()
		}
	},
	async created() {
		this.$nextTick(() => {
			document.body.classList.add('lottery-main');
		})
		this.rootMain.loader(true);
		await this.initLottery();
		this.rootMain.loader(false);
		DORMANCY_LAST_TIME = Date.now();
		DORMANCY_TIMER = setInterval(()=>{
		    if(Math.abs(Date.now() - DORMANCY_LAST_TIME) > 3000) {
		        this.initLottery();
		    }
		    DORMANCY_LAST_TIME = Date.now();
		}, 1000);
	},
	destroyed() {
		document.body.classList.remove('lottery-main');

		if (RECIPROCAL_END_TIMER) clearTimeout(RECIPROCAL_END_TIMER);
		if(DORMANCY_TIMER) clearInterval(DORMANCY_TIMER);
	},
	methods: {
		async initLottery() {
			await this.lotteryServer.home().then(r => {
				let luckNumber = sessionStorage.getItem('luck_number');
				this.luck = r.data.lot;
				this.luck.servertime = r.data.servertime;

				//设置侧滑栏链接
				this.rootMain.setSideUrl(r.data.lot.detail, r.data.lot.rule_url, r.data.lot.records);

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
			}, error => {
				this.rootMain.loader(false);
			});
		},
		openLastPrize() {
			if (this.currentPrize.lev != 1) return;
			let result = this.lotteryOpen.filter(index => index == 1);
			if (result.length === this.lotteryOpen.length) return;
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
