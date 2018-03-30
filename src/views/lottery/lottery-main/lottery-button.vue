<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
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
	<div class="lottery-button">
		<ask-button class="play-btn" :disabled="buttonInfo.disabled" :text="buttonInfo.value" @ask-click="onClick">
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
export default {
	name: "lottery-button",
	inject: ['rootMain', 'lotteryMain'],
	props: ['luck', 'lotteryRef'],
	data(){
		return {
			numberShow:false,
			number: 0
		}
	},
	computed: {
		buttonInfo: {
			get(){
				let bt = {
					disabled: false,
					value: '领取兑奖号'
				};
				if (this.luck && this.luck.state) {
					if (this.luck.state === this.lotteryRef.BEFORE) {
						bt.disabled = false;
						bt.value = '领取兑奖号';
					}
					if (this.luck.state === this.lotteryRef.RECEIVE) {
						bt.disabled = false;
						bt.value = this.luck.has_get_code ? '我的兑奖号' : '领取兑奖号';
					}
					if (this.luck.state === this.lotteryRef.RECEIVEING || this.luck.state === this.lotteryRef.UNDERWAY) {
						bt.disabled = !this.luck.has_get_code;
						bt.value = this.luck.has_get_code ? '我的兑奖号' : '领号结束';
						if (this.luck.cur_prize_lev == 1 && this.luck.is_lucky) {
							bt.value = '幸运大使抽号';
							let sLuckNumber = sessionStorage.getItem('luck_number');
							if (sLuckNumber) bt.value = `您抽的幸运数字:${sLuckNumber}`;
						}
					}
					if (this.luck.state === this.lotteryRef.FINISH) {
						bt.disabled = false;
						bt.value = '本期中奖记录';
					}
				}
				return bt;
			},
			set(val){}
		}
	},
	methods: {
		onClick() {
			this.getLuckNumber();
			return;
			switch (this.luck.state) {
				case this.lotteryRef.BEFORE:
					this.lotteryMain.receiveNotice();
					break;
				case this.lotteryRef.RECEIVE:
					this.lotteryMain.chanceNotice();
					break;
				case this.lotteryRef.RECEIVEING:
					this.lotteryMain.chanceNotice();
					break;
				case this.lotteryRef.UNDERWAY:
					this.getLuckNumber();
					break;
				case this.lotteryRef.FINISH:
					window.location.href = this.luck.urls.detail;
					break;
				default:
					console.log(this.luck.state);
			}
		},
		getLuckNumber() {
			if (this.lotteryMain.currentPrize.lev != 1) {
				this.$router.push({ name: 'lotteryCode' });
				return;
			}
			if (this.luck.is_lucky && this.lotteryMain.currentPrize.lev == 1) {
				let sLuckNumber = sessionStorage.getItem('luck_number');
				if (sLuckNumber) return;
				this.rootMain.loader(true);
				this.lotteryMain.lotteryServer.getLuckNumber().then(res => {
					this.rootMain.loader(false);
					this.numberShow = true;
					this.number = res.data.num;
					sessionStorage.setItem('luck_number', res.data.num);
				}, error => {
					this.rootMain.loader(false);
				});
			}
		},
		beforeClose(close){
			close();
			let sLuckNumber = sessionStorage.getItem('luck_number');
			if (sLuckNumber) this.buttonInfo.value = `您抽的幸运数字:${sLuckNumber}`;
			this.number = 0;
		}
	}
}

</script>
