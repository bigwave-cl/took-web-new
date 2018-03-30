<template>
	<div class="draw-lottery-main" v-if="show">
		<template v-if="currentPrize.lev == 1">
			<div class="open-prize">
				<h2><em>{{currentPrize.name}}：</em><em>{{cloudIntegral}}</em>{{luck.unit || "积分"}}</h2>
				<div class="space-box open-prize-num">
					<p>
						<i class="iconfont icon-participatio"></i>共
						<em>{{luck&&luck.join_num}}</em>人参与
					</p>
				</div>
				<slot></slot>
			</div>
		</template>
		<template v-else>
			<div class="open-prize">
				<h2><em>{{currentPrize.name}}：</em><em>{{cloudIntegral}}</em>{{luck.unit || "积分"}}</h2>
				<h5>中奖号码</h5>
				<h2><em>{{currentPrize.codes}}</em></h2>
			</div>
			<p class="single-p">
				<reciprocal :server="luck&&luck.servertime" :time="reciprocalTime">
					<reciprocal-title>
						<i class="iconfont icon-time"></i>开奖时间剩余</reciprocal-title>
				</reciprocal>
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
		</template>
	</div>
</template>
<script>
import { amountFormat } from '@/utils';
import reciprocal from '@core/reciprocal/reciprocal.vue'
import reciprocalTitle from '@core/reciprocal/reciprocal-title.vue'
export default {
	name: "draw-lottery-main",
	components: {
		"reciprocal": reciprocal,
		"reciprocal-title": reciprocalTitle
	},
	inject: ['lotteryMain'],
	props: ['luck', 'show', 'currentPrize'],
	computed: {
		cloudIntegral() {
			let ci = (this.currentPrize && this.currentPrize.yb) || 0;
			return amountFormat(ci);
		},
		reciprocalTime() {
			return this.currentPrize && this.currentPrize.next_open_time;
		}
	},
}

</script>
