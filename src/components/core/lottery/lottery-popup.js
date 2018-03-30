/*
 * @Author: askMeWhy
 * @Date:   2017-10-23 16:55:52
 * @Last Modified by:   smile
 * @Last Modified time: 2017-12-07 17:31:09
 */
import {
	askDialogAlert,
	askDialogToast,
	timeConvert
} from '@/utils';

import winnerNo from '@/assets/lottery/picture_failure.png';
import winnerYes from '@/assets/lottery/picture_winning.png';
export default {
	methods: {
		receiveNotice() {
			let difference = this.timeDiffer(this.luck.get_code_begin);

			let cur = timeConvert(difference);

			let text = `${cur.d > 0 ? cur.d+'天':''}
						${cur.d > 0 || cur.h > 0 ? cur.h+'时':''}
						${cur.d > 0 || cur.h > 0 || cur.m > 0 ? cur.m+'分':''}
						${cur.d > 0 || cur.h > 0 || cur.m > 0 || cur.s > 0 ? cur.s:'00'}秒`.trim();

			let vm = askDialogAlert({
				title: '',
				content: `剩余${text}开始领号`,
				btnText: '确定',
				class: 'lottery-chance',
				showClose:false
			}, (ok) => {
				ok.close();
			})
		},
		chanceNotice() {
			if (this.luck.times) {
				this.$router.push({ name: 'lotteryCode' });
				return;
			}

			let alertContent = `
				您的免费${this.luck.is_try ? '体验期数':'兑奖机会'}已用完
			`;
			askDialogAlert({
				title: '',
				content: alertContent,
				btnText: '确定',
				class: 'lottery-chance',
				showClose:false
			}, (ok) => {
				ok.close();
			})
		},
		//每轮兑奖提示是否中奖
		winningOfNotice() {
			let _winner = this.currentPrize.is_winner;

			let alertContent = `
				<div class="winner-header">
					<img src="${_winner ? winnerYes:winnerNo}">
				</div>
				<div class="winner-body ${_winner ? 'yes':''}">
					<h3>${_winner ? '恭喜你中奖啦':'谢谢参与'}</h3>
					<h3>${_winner ? this.currentPrize.name+':'+ this.currentPrize.yb:'您本轮没有中奖'}</h3>
					<p>
						温馨提示：兑奖机会越多，中大奖几率越高哦，赶快去商家商城购买商品增加兑奖机会吧！
					</p>
				</div>
			`;
			this.$nextTick(() => {
				let recordV = sessionStorage.getItem(this.currentPrize.id);
				if (recordV || !_winner) return;

				sessionStorage.setItem(this.currentPrize.id, true);

				askDialogAlert({
					title: '',
					content: alertContent,
					btnText: '我知道了',
					class: 'lottery-winner-box',
					showClose: _winner
				}, (ok) => {
					ok.close();
				})
			})
		},
		//幸运大使弹框
		luckRule() {
			let alertContent = `
				<div class="rule-body">
					<p>
						1、领取兑奖号码结束后，系统将随机挑选多位幸运大使。
					</p>
					<p>
						2、多位幸运大使将在开启最终大奖时共同揭晓中奖号码。
					</p>
				</div>
			`;
			this.$nextTick(() => {
				askDialogAlert({
					title: '什么是幸运大使？',
					content: alertContent,
					btnText: '我知道了',
					class: 'lottery-rule-box',
					showClose:false
				}, (ok) => {
					ok.close();
				})
			})
		},
		//体验次数说明弹框
		freeRule() {
			let alertContent = `
				<div class="rule-body">
					<p>
						1、为让每个人都有参与兑奖的机会，每个用户拥有共计${this.luck.try_times || 0}期的免费体验机会，每期体验机会仅可获得一个兑奖号码。
					</p>
					<p>
						2、免费体验机会次数不可和普通兑奖机会次数叠加。
					</p>
				</div>
			`;
			this.$nextTick(() => {
				askDialogAlert({
					title: '什么是免费体验期数？',
					content: alertContent,
					btnText: '我知道了',
					class: 'lottery-rule-box',
					showClose: false
				}, (ok) => {
					ok.close();
				})
			})
		}
	}
}
