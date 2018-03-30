<template>
	<ask-refresh
		:mode="3"
		@upward="upward" 
		:upwardRef = "upwardRef"
		:upwardTip="upwardTip"
		@down="down" 
		:downRef = "downRef"
		:downTip="downTip"
		>
		<product-list :products="products"></product-list>
	</ask-refresh>
</template>
<script>
import productList from '../product/product-list.vue';

import { Lottery } from '@/services';
export default {
	name: "chat-component",
	props: ['show'],
	components: {
		"product-list": productList
	},
	data() {
		return {
			products: [],
			offset: 0,
			downRef: "START",
			upwardRef: "START",
			downTip: "刷新成功",
			upwardTip: "加载完成"
		}
	},
	created() {
		if (this.show) {
			this.initGood();
		}
	},
	watch: {
		show(n, o) {
			if (n && this.offset == 0) {
				this.initGood();
			}
		}
	},
	methods: {
		initGood() {
			const lotteryServer = new Lottery();
			lotteryServer.goods(this.offset).then(r => {
				this.products = r.data.list;
				this.offset = r.data.offset;
			})
		},
		upward() {
			this.upwardRef = 'ON'; //异步加载请求中
			const lotteryServer = new Lottery();
			lotteryServer.goods(this.offset).then(r => {
				if (r.data.hasmore) {
					r.data.list.map(index => {
						this.products.push(index);
					})
					this.offset = r.data.offset;
				}
				if (!r.data.hasmore) {
					this.upwardTip = "已全部加载";
				}

				this.upwardRef = 'OVER'; //异步加载请完成
				this.$nextTick(() => { //全部操作加载完成之后恢复默认值
					this.upwardRef = 'START';
				});
			});
		},
		down() {
			this.downRef = 'ON'; //异步加载请求中
			const lotteryServer = new Lottery();
			lotteryServer.goods().then(r => {
				this.products = r.data.list;
				this.hasmore = r.data.hasmore;
				this.offset = r.data.offset;

				this.downRef = 'OVER'; //异步加载请完成
				this.$nextTick(() => { //全部操作加载完成之后恢复默认值
					this.downRef = 'START';
				});
			});
		}
	}
}

</script>
