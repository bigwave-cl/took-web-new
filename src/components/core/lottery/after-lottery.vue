<style lang="scss">
.after-box {
	.button-group {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}
}

</style>
<template>
	<div class="after-box" v-if="show">
		<div class="title">
			<h3>上期开奖金额</h3>
			<ask-button @ask-click="awardDetail">
				<i class="iconfont icon-ellipsis"></i>
			</ask-button>
		</div>
		<div class="text large">
			{{cloudIntegral}}
			<small>{{luck.unit || "积分"}}</small>
		</div>
		<div class="button-group">
			<ask-button @ask-click="awardInfo">
				<span class="button-text" v-text="'往期中奖记录'">
				</span>
			</ask-button>
		</div>
	</div>
</template>
<script>
import { amountFormat } from '@/utils';
export default {
	name: "after-lottery",
	inject: ['lotteryMain'],
	props: ['show', 'luck'],
	computed: {
		cloudIntegral() {
			let ci = (this.luck && this.luck.open_yb) || 0;
			return amountFormat(ci);
		}
	},
	methods: {
		awardDetail() {
			this.$router.push({ name: 'lotteryDetail' });
		},
		awardInfo() {
			this.$router.push({ name: 'lotteryDetail' });
		}
	}

}

</script>
