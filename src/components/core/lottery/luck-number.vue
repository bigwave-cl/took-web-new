<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.luck-number-box {
	width: 100%;
	text-align: center;
	padding-top: 10px;
	.luck-number-button {
		width: 66px;
		height: 55px;
		min-width: auto;
		background: no-repeat url($baseUrl+'lottery/icon_stop.png');
		background-size: 100% 100%;
		&.not_lucky {
			height: 42px;
			background: no-repeat url($baseUrl+'lottery/icon_stop_disabled.png');
			background-size: 100% 100%;
		}
	}
}

.ask-modal-box.luck-number {
	.ask-modal-wrapper{
		width: 100%;
		max-width: 375px;
		/* 750px*/
		height: 70%;
		max-height: 516px;
		/* 1032px*/
		pointer-events: none;
		background-color: transparent;
		-webkit-box-shadow: none;
		box-shadow: none;
	}
	.ask-modal-body, .custom {
		width: 100%;
		height: 100%;
	}
	.luck-number-body {
		width: 100%;
		height: 100%;
		.luck-number-bg {
			position: relative;
			z-index: 2;
			width: 100%;
			height: 100%;
			background: no-repeat center url($baseUrl+'lottery/luck-number/bg.png') transparent;
			background-size: 100% auto;
			.luck-number-result {
				position: relative;
				z-index: 5;
				top: 50%;
				width: 100%;
				height: 35%;
				-webkit-transform: translateY(-50%);
				transform: translateY(-50%);
				background: no-repeat center url($baseUrl+'lottery/luck-number/0.png') transparent;
				background-size: auto 100%;
				&.num-0 {
					background: no-repeat center url($baseUrl+'lottery/luck-number/0.png') transparent;
					background-size: auto 100%;
				}
				&.num-1 {
					background: no-repeat center url($baseUrl+'lottery/luck-number/1.png') transparent;
					background-size: auto 100%;
				}
				&.num-2 {
					background: no-repeat center url($baseUrl+'lottery/luck-number/2.png') transparent;
					background-size: auto 100%;
				}
				&.num-3 {
					background: no-repeat center url($baseUrl+'lottery/luck-number/3.png') transparent;
					background-size: auto 100%;
				}
				&.num-4 {
					background: no-repeat center url($baseUrl+'lottery/luck-number/4.png') transparent;
					background-size: auto 100%;
				}
				&.num-5 {
					background: no-repeat center url($baseUrl+'lottery/luck-number/5.png') transparent;
					background-size: auto 100%;
				}
				&.num-6 {
					background: no-repeat center url($baseUrl+'lottery/luck-number/6.png') transparent;
					background-size: auto 100%;
				}
				&.num-7 {
					background: no-repeat center url($baseUrl+'lottery/luck-number/7.png') transparent;
					background-size: auto 100%;
				}
				&.num-8 {
					background: no-repeat center url($baseUrl+'lottery/luck-number/8.png') transparent;
					background-size: auto 100%;
				}
				&.num-9 {
					background: no-repeat center url($baseUrl+'lottery/luck-number/9.png') transparent;
					background-size: auto 100%;
				}
			}
		}
	}
}

</style>
<template>
	<div class="luck-number-box">
		<ask-button class="luck-number-button" :disabled="extract || lotteryMain.luckNumberDisabled" :class="{not_lucky:!luck.is_lucky}" @ask-click="getLuckNumber">
		</ask-button>

		<ask-modal 
			:show.sync="numberShow"
			:beforeClose="beforeClose"
			:showHeader="false"
			:showFooter="false"
			:time="3000"
			class="luck-number"
			>
			<div class="luck-number-body">
				<div class="luck-number-bg">
					<div class="luck-number-result" :class="'num-'+number"></div>
				</div>
			</div>
		</ask-modal>
	</div>
</template>
<script>
import { sessionStorage } from '@/utils';
import { Lottery } from '@/services';
export default {
	name: "luck-number",
	inject: ['rootMain', 'lotteryMain'],
	props: ['luck'],
	data() {
		return {
			extract: false,
			numberShow:false,
			number: 0
		}
	},
	created() {
		let sLuckNumber = sessionStorage.getItem('luck_number');
		this.extract = sLuckNumber ? true : false;
	},
	methods: {
		getLuckNumber() {
			if (this.luck.is_lucky && this.lotteryMain.currentPrize.lev == 1) {
				let sLuckNumber = sessionStorage.getItem('luck_number');
				if (sLuckNumber) return;
				this.rootMain.loader(true);
				this.lotteryMain.lotteryServer.getLuckNumber().then(res => {
					this.rootMain.loader(false);
					this.numberShow = true;
					this.number = res.data.num;
					sessionStorage.setItem('luck_number', res.data.num);
					this.extract = true;
				}, error => {
					this.rootMain.loader(false);
				});

			}
		},
		beforeClose(close){
			close();
			this.number = 0;
		}
	}
}

</script>
