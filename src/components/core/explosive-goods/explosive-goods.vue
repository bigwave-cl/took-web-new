<template>
	<ask-scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
		<template slot="refresh">
			<scroll-before>下拉刷新</scroll-before>
			<scroll-loosen>松开刷新</scroll-loosen>
			<scroll-in>
				<div class="ask-refresh-lodaer">
					<div>A</div>
					<div>S</div>
					<div>K</div>
				</div>
			</scroll-in>
			<scroll-end>
				<template v-if="refreshSuccess">
					刷新成功
				</template>
				<template v-else>
					刷新失败
				</template>
			</scroll-end>
		</template>
		<product-list :products="products"></product-list>
		<template v-if="!infiniteMore" slot="infinite">
			<div>已加载全部数据</div>
		</template>
	</ask-scroll>
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
			refreshSuccess:true,
			infiniteMore: true
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
		onInfinite(done) {
			const lotteryServer = new Lottery();
			lotteryServer.goods(this.offset).then(r => {
				if(this.infiniteMore){
					r.data.list.map(index => {
						this.products.push(index);
					})
					this.offset = r.data.offset;
				}
				this.infiniteMore = r.data.hasmore;
				this.$nextTick(() => { 
					done();
				});
			},error=>{
				done();
			});
		},
		onRefresh(done) {
			const lotteryServer = new Lottery();
			lotteryServer.goods().then(r => {
				this.products = r.data.list;
				this.infiniteMore = r.data.hasmore;
				this.offset = r.data.offset;
				this.refreshSuccess = true;
				this.$nextTick(() => { 
					done();
				});
			},error=>{
				this.refreshSuccess = false;
				done();
			});
		}
	}
}

</script>
