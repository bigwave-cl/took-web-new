<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.lottery-code-box {
	margin: 10px;
	padding: 20px;
	border-radius: 4px;
	background-color: map-get($color, 200);
	.lottery-code-header {
		@include flexLayout(flex, around, center);
		padding: 20px 0 27px;
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		-ms-flex-flow: row wrap;
		flex-flow: row wrap;
		h3 {
			font-size: 1.6rem;
			font-weight: normal;
			margin: 0;
			color: map-get($color, 100);
		}
		a {
			font-size: 1.2rem;
			cursor: pointer;
			text-decoration: underline;
			color: map-get($color, 400);
		}
	}
	p {
		font-size: 1.4rem;
		font-weight: normal;
		line-height: 1.8rem;
		margin: 0;
		text-align: center;
		word-break: break-all;
		color: map-get($color, 300M);
	}
	.lottery-code-body {
		.img-box {
			width: 60vw;
			margin: 0 auto 0;
		}
		.img-box>img {
			width: 100%;
			vertical-align: bottom;
		}
		.text.small {
			font-size: 1.6rem;
			text-align: center;
			color: map-get($color, 400);
		}
		.lottery-number {
			margin: -15% 0 10%;
			text-align: center;
			.text.large {
				font-size: 1.6rem;
				color: map-get($color, 400);
			}
			.number-box {
				@include flexLayout(flex, center, center);
				width: 220px;
				margin: 5% auto 0;
				-webkit-box-orient: horizontal;
				-webkit-box-direction: normal;
				-ms-flex-flow: row nowrap;
				flex-flow: row nowrap;
				span {
					font-size: 2rem;
					display: block;
					margin: 3% 0;
					text-align: center;
					color: #ed6347;
					-webkit-box-flex: 0;
					-ms-flex: 0 0 33.33%;
					flex: 0 0 33.33%;
					&.win{
						color: map-get($color,300D1);
						text-decoration: line-through;
					}
				}
			}
		}
	}
}

</style>
<template>
	<div class="lottery-code-box">
		<div class="lottery-code-header">
			<h3>
				<span v-if="item&&item.is_try">剩余体验次数</span>
				<span v-else>您共有兑奖机会</span>
				:{{item&&item.times}}次
			</h3>
			<a href="javascript:void(0);" @click="rule">如何获得或增加兑奖机会？</a>
		</div>
		<p v-if="item&&item.is_lucky">恭喜您被选为“幸运大使”,请您</p>
		<p v-if="item&&item.is_lucky">在开奖时来抽取幸运数字，开出本期的大奖</p>
		<div class="lottery-code-body">
			<div class="img-box">
				<img src="~@/assets/lottery/picture_gift.png">
			</div>
			<div class="lottery-number" v-if="codes.length > 0">
				<div class="text large">您参与兑奖的号码为</div>
				<div class="number-box" v-for="(once,$i) in codes" :key="$i">
					<span v-for="(c,$j) in once" :key="$j" :class="{win: c.win}"v-text="c.code">
					</span>
				</div>
			</div>
			<div class="text small">提前来兑奖中心，就不怕错过大奖！</div>
		</div>
	</div>
</template>
<script>
import { Lottery } from '@/services';
import {
	askDialogAlert
} from '@/utils';

export default {
	name: "lottery-code",
	inject: ['rootMain'],
	data() {
		return {
			item: {},
			codes: []
		}
	},
	created() {
		const lotteryServer = new Lottery();
		this.rootMain.loader(true);
		lotteryServer.code().then(res => {
			this.rootMain.loader(false);
			this.item = res.data;
			this.codes = this.hadlerCode(res.data.codes);
		}, error => {
			this.rootMain.loader(false);
		})
	},
	methods: {
		rule() {
			let alertContent = `
				<div class="rule-body">
					<p>
						您在兑奖活动所属商家购买商品，单笔订单的金额达到${this.item.order_min_yb}元，增加一次兑奖机会，即可多获得一个兑奖号码，参与兑奖次数无上限，若在领号时间结束后，新增加的兑奖次数将在下一次的兑奖活动中生效，本期活动不增加。
					</p>
				</div>
			`;
			this.$nextTick(() => {
				askDialogAlert({
					title: '如何获得或增加兑奖机会？',
					content: alertContent,
					btnText: '我知道了',
					class: 'lottery-rule-box',
					showClose: false
				}, (ok) => {
					ok.close();
				})
			})
		},
		hadlerCode(codes) {
			//为了兼容低配手机不支持flex-flow的wrap特性
			if(codes.length <= 0) return;
			let l = codes.length,
				_c = [],
				standard = 3;

			for (let i = 0; i < l; i += standard) {
				let _cur = [];
				if (codes[i]) _cur.push(codes[i]);
				if (codes[i + 1]) _cur.push(codes[i + 1]);
				if (codes[i + 2]) _cur.push(codes[i + 2]);

				_c.push(_cur);
			}
			return _c;
		}
	}
}

</script>
