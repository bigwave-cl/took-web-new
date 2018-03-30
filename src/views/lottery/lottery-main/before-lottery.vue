<template>
	<div class="before-lottery-main" v-if="show">
		<h4>本期开奖金额</h4>
		<h2><em>{{cloudIntegral}}</em>{{luck.unit || "积分"}}</h2>
		<slot name="lucky-list"></slot>
		<p class="single-p">
			<reciprocal :server="luck&&luck.servertime" :time="reciprocalTime">
				<reciprocal-title>
					<i class="iconfont icon-time"></i>开奖时间剩余</reciprocal-title>
			</reciprocal>
		</p>
		<p class="single-p">
			<i class="iconfont icon-chance"></i>
			<span v-if="luck&&luck.is_try">剩余体验次数</span>
			<span v-else>您共有兑奖机会</span>
			<em>{{luck&&luck.times}}</em>次
			<i @click="lotteryMain.freeRule" class="iconfont icon-help"></i>
		</p>
		<div class="space-box">
			<p>
				<i class="iconfont icon-participatio"></i>共
				<em>{{luck&&luck.join_num}}</em>人参与
			</p>
			<router-link :to="{ name: 'lotteryDetail'}">
				<ask-button class="space-btn" :text="'奖项详情'"></ask-button>
			</router-link>
		</div>
	</div>
</template>
<script>
import { amountFormat } from '@/utils';
import reciprocal from '@core/reciprocal/reciprocal.vue'
import reciprocalTitle from '@core/reciprocal/reciprocal-title.vue'
export default {
	name: "before-lottery-main",
	components: {
		"reciprocal": reciprocal,
		"reciprocal-title": reciprocalTitle
	},
	inject: ['lotteryMain'],
	props: ['luck', 'show'],
	computed: {
		cloudIntegral() {
			let ci = (this.luck && this.luck.open_yb) || 0;
			return amountFormat(ci);
		},
		reciprocalTime() {
			return this.luck && this.luck.open_time;
		}
	}
}

</script>
