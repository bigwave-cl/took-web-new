<template>
	<div class="after-lottery-main">
		<h5>
			幸运大使<i @click="lotteryMain.luckRule" class="iconfont icon-help"></i>
		</h5>
		<ul class="lucky-list">
			<li v-for="(envoy,$i) in envoys" :key="$i" class="lucky-li">
				<div class="img-box">
					<img src='~@/assets/lottery/logo.png' v-if="!envoy.thumb_pic">
					<img :src='envoy.thumb_pic' v-else>
				</div>
				<div class="text">
					{{envoy.name}}
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
import { amountFormat } from '@/utils';
export default {
	name: "lucky-list",
	inject: ['lotteryMain'],
	props: ['luck'],
	computed: {
		envoys() {
			let items = [
				{ thumb_pic: null, name: '虚位以待' }, { thumb_pic: null, name: '虚位以待' },
				{ thumb_pic: null, name: '虚位以待' }, { thumb_pic: null, name: '虚位以待' }
			];

			if (this.luck && this.luck.luck_user.length != 0) {
				items = this.luck.luck_user.map(index => {
					if (!index.thumb_pic) {
						index.thumb_pic == '';
					}
					return index;
				})
			}
			return items;
		}
	}
}

</script>
