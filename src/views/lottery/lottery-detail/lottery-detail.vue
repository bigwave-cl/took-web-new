<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.lottery-detail-box {
	width: 100%;
	width: 100vw;
	padding: 30px 0 15px 0;
	text-align: center;
	h4 {
		font-size: 2rem;
		font-weight: 600;
		margin: 0;
		padding: 0;
		text-align: center;
		color: map-get($color, 200);
	}
	h2 {
		font-size: 2.2rem;
		font-weight: normal;
		margin: 0;
		padding: 6px;
		text-align: center;
		letter-spacing: 1px;
		color: map-get($color, 200);
		em {
			font-style: normal;
		}
	}
	p {
		font-size: 1.6rem;
		margin: 0;
		text-align: left;
		color: map-get($color, 200);
		em {
			font-style: normal;
			margin: 0 3px;
			color: map-get($color, 300);
		}
		i {
			margin: 0 6px;
			cursor: pointer;
		}
	}
	.single-p, .space-box {
		width: 90%;
		width: 90vw;
		margin: 12px auto;
	}
	.space-box {
		@include flexLayout(flex, justify, center);
		&.open-prize-num {
			-webkit-box-pack: end;
			-ms-flex-pack: end;
			justify-content: flex-end;
		}
	}
	.lucky-list {
		width: 90%;
		width: 90vw;
		margin: 0 auto;
		.lucky-li {
			@include flexLayout(flex, justify, center);
			margin: 5% 0;
			margin: 5vw 0;
			.text {
				font-size: 1.8rem;
				text-align: left;
				color: map-get($color, 200);
				h5 {
					font-size: 1.8rem;
					font-weight: normal;
					display: inline-block;
					width: 60px;
					margin: 0;
				}
				span {
					display: inline-block;
					word-break: break-all;
					color: map-get($color, 300);
				}
				&.prize-integral {
					@include flexLayout(flex, normal, normal);
					-webkit-box-flex: 1;
					-ms-flex: 1 1 auto;
					flex: 1 1 auto;
					h5 {
						min-width: 70px;
						-webkit-box-flex: 0;
						-ms-flex: 0 1 auto;
						flex: 0 1 auto;
					}
					span {
						text-align: left;
						-webkit-box-flex: 0;
						-ms-flex: 0 1 auto;
						flex: 0 1 auto;
					}
				}
				&.people {
					text-align: right;
					-webkit-box-flex: 0;
					-ms-flex: 0 0 85px;
					flex: 0 0 85px;
				}
			}
		}
	}
	.ask-button.state-btn {
		margin-top: 90px;
		margin-top: 14vh;
		padding: 6px 30px;
		border-radius: 4px;
		background-color: map-get($color, 300);
		.button-text {
			font-size: 1.8rem;
			padding: 0;
			color: map-get($color, 100);
		}
		&:disabled,
		&.wihte-btn {
			border: 2px solid map-get($color, 200);
			background-color: transparent;
			.button-text {
				color: map-get($color, 200);
			}
		}
	}
}

.ask-modal.luck-state-0 {
	width: 70%;
	min-height: 30px;
	.ask-modal-header {
		padding: 0;
	}
	.ask-alert-box {
		padding-top: 16px;
		text-align: center;
		color: map-get($color, 100);
	}
	.ask-modal-footer {
		padding: 20px 0 10px;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		.ask-alert-btn {
			width: 80px;
			padding: 4px 10px;
			color: map-get($color, 100);
			border-radius: 20px;
			background-color: map-get($color, 300);
		}
	}
}

</style>
<template>
	<div class="lottery-detail-box">
		<h4>本期开奖金额</h4>
		<h2><em>{{cloudIntegral}}</em>{{detail.unit || "积分"}}</h2>
		<div class="space-box open-prize-num">
			<p>
				<i class="iconfont icon-participatio"></i>共
				<em>{{detail&&detail.join_num}}</em>人参与
			</p>
		</div>
		<ul class="lucky-list">
			<li v-for="(envoy,$i) in list" :key="$i" class="lucky-li">
				<div class="text prize-integral">
					<h5>{{envoy.name}}:</h5>
					<span>{{envoy.integral}}{{detail.unit || "积分"}}</span>
				</div>
				<div class="text people">
					共{{envoy.people}}名
				</div>
			</li>
		</ul>
		<ask-button :disabled="buttonInfo.disabled" class="state-btn wihte-btn" :text="buttonInfo.value" @ask-click="onClick"></ask-button>
	</div>
</template>
<script>
import { Lottery } from '@/services';
import {
	askDialogAlert,
	amountFormat
} from '@/utils';

export default {
	name: "lottery-detail",
	inject: ['rootMain'],
	data() {
		return {
			lotteryRef: {
				BEFORE: 0, //活动未开始
				RECEIVE: 1, //开始领取兑奖号
				RECEIVEING: 2, //领取兑奖号
				UNDERWAY: 3, //活动进行中
				FINISH: 4, //活动已结束
			},
			detail: null,
			list: []
		}
	},
	computed: {
		cloudIntegral() {
			let ci = (this.detail && this.detail.open_yb) || 0;
			return amountFormat(ci);
		},
		buttonInfo() {
			let bt = {
				disabled: true,
				value: '活动未开始'
			};
			if (this.detail && this.detail.state) {
				if (this.detail.state === this.lotteryRef.BEFORE) {
					bt.disabled = true;
					bt.value = '活动未开始';
				}
				if (this.detail.state === this.lotteryRef.RECEIVE) {
					bt.disabled = false;
					bt.value = this.detail.has_get_code ? '我的兑奖号' : '领取兑奖号';
				}
				if (this.detail.state === this.lotteryRef.RECEIVEING || this.detail.state === this.lotteryRef.UNDERWAY) {
					bt.disabled = !this.detail.has_get_code;
					bt.value = this.detail.has_get_code ? '我的兑奖号' : '领号结束';
				}
				if (this.detail.state === this.lotteryRef.FINISH) {
					bt.disabled = true;
					bt.value = '活动已结束';
				}
			}
			return bt;
		}
	},
	created() {
		this.$nextTick(() => {
			document.body.classList.add('lottery-main');
		})
		this.initDetail();
	},
	destroyed() {
		document.body.classList.remove('lottery-main');
	},
	methods: {
		initDetail() {
			const lotteryServer = new Lottery();
			this.rootMain.loader(true);
			lotteryServer.detail().then(r => {
				this.rootMain.loader(false);
				this.detail = r.data;
				this.detail.state = parseInt(this.detail.state, 10);
				this.list = r.data.prizes.map(index => {
					let once = {
						name: '',
						integral: '',
						people: ''
					}
					once.name = index.name;
					once.people = index.num;
					once.integral = amountFormat(index.yb);
					return once;
				});

			}, error => {
				this.rootMain.loader(false);
			});
		},
		onClick() {
			if (this.detail.has_get_code || this.detail.times) {
				this.$router.push({ name: 'lotteryCode' });
				return;
			}

			let alertContent = `
				您的免费${this.detail.is_try ? '体验期数':'兑奖机会'}已用完
			`;
			askDialogAlert({
				title: '',
				content: alertContent,
				btnText: '确定',
				class: 'lottery-chance',
				showClose: false
			}, (ok) => {
				ok.close();
			})
		}
	}
}

</script>
