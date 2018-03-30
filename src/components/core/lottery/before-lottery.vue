<style lang="scss">
.before-box {
	.reciprocal-body {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		transform: translateY(45%);
	}
}

</style>
<template>
	<div class="before-box" v-if="show">
		<div class="title">
			<h3>本期开奖金额</h3>
			<ask-button @ask-click="awardDetail">
				<i class="iconfont icon-ellipsis"></i>
			</ask-button>
		</div>
		<div class="text large">
			{{cloudIntegral}}
			<small>{{luck.unit || "积分"}}</small>
		</div>
		<div class="button-group">
			<ask-button :disabled="buttonInfo.disabled" @ask-click="awardInfo">
				<span class="button-text" v-text="buttonInfo.value">
				</span>
			</ask-button>
		</div>
		<div class="reciprocal-body">
			<reciprocal :server="luck&&luck.servertime" :time="reciprocalTime">
				<reciprocal-title>本期开奖倒计时:</reciprocal-title>
			</reciprocal>
		</div>
	</div>
</template>
<script>
import reciprocal from '../reciprocal/reciprocal.vue'
import reciprocalTitle from '../reciprocal/reciprocal-title.vue'
import { amountFormat } from '@/utils';
export default {
	name: "before-lottery",
	components: {
		"reciprocal": reciprocal,
		"reciprocal-title": reciprocalTitle
	},
	inject: ['lotteryMain'],
	props: ['show', 'luck'],
	computed: {
		cloudIntegral() {
			let ci = (this.luck && this.luck.open_yb) || 0;
			return amountFormat(ci);
		},
		reciprocalTime() {
			return this.luck && this.luck.open_time;
		},
		buttonInfo() {
			let bt = {
				disabled: false,
				value: '领取奖号'
			};
			let state = this.luck && this.luck.state;
			if (state === this.lotteryMain.lotteryRef.BEFORE || state === this.lotteryMain.lotteryRef.RECEIVE) {
				bt.value = this.luck.has_get_code ? '我的兑奖号' : '领取奖号';
			} else {
				bt.value = this.luck.has_get_code ? '我的兑奖号' : '领号结束';
				bt.disabled = !this.luck.has_get_code;
			}
			return bt;
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
