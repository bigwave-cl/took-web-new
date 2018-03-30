<template>
	<div class="after-lottery-main" v-if="show">
		<h4>上期开奖金额</h4>
		<h2><em>{{cloudIntegral}}</em>{{luck.unit || "积分"}}</h2>
		<h1>已结束，等待下次兑奖</h1>
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
export default {
	name: "after-lottery-main",
	props: ['luck', 'show'],
	computed: {
		cloudIntegral() {
			let ci = (this.luck && this.luck.open_yb) || 0;
			return amountFormat(ci);
		}
	}
}

</script>
