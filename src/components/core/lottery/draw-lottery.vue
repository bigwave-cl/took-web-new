<template>
	<div class="draw-box" v-if="show">
		<div class="title">
			<h3>{{currentPrize.name}}</h3>
			<ask-button @ask-click="awardDetail">
				<i class="iconfont icon-ellipsis"></i>
			</ask-button>
		</div>
		<div class="text large">
			{{cloudIntegral}}
			<small>{{luck.unit || "积分"}}</small>
		</div>
		<template v-if="luck&&luck.cur_prize_lev != 1">
			<div class="reciprocal-body">
				<reciprocal :server="luck&&luck.servertime" :time="reciprocalTime">
					<reciprocal-title>下一奖项开奖倒计时:</reciprocal-title>
				</reciprocal>
			</div>
		</template>
		<template v-if="luck && luck.cur_prize_lev == 1 && luck.is_lucky">
			<luck-number :luck="luck"></luck-number>
		</template>
	</div>
</template>
<script>
import reciprocal from '../reciprocal/reciprocal.vue'
import reciprocalTitle from '../reciprocal/reciprocal-title.vue'
import luckNumber from './luck-number.vue';
import { amountFormat } from '@/utils';
export default {
	name: "before-lottery",
	components: {
		"reciprocal": reciprocal,
		"reciprocal-title": reciprocalTitle,
		"luck-number": luckNumber,
	},
	inject: ['lotteryMain'],
	props: ['show', 'luck', 'currentPrize'],
	computed: {
		cloudIntegral() {
			let ci = (this.currentPrize && this.currentPrize.yb) || 0;
			return amountFormat(ci);
		},
		reciprocalTime() {
			return this.currentPrize && this.currentPrize.next_open_time;
		}
	},
	methods: {
		awardDetail() {
			this.$router.push({ name: 'lotteryDetail' });
		},
		awardInfo() {
			if (this.luck.state === this.lotteryMain.lotteryRef.BEFORE) {
				this.lotteryMain.receiveNotice();
			} else {
				this.lotteryMain.chanceNotice();
			}

		}
	}

}

</script>
