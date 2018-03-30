<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.winning-codes-box.chance {
	@include flexLayout(flex, normal, center);
	.codes {
		flex: 1 0 auto;
		width: calc(100% - 84px);
		@include textEllipsis(1);
	}
	.buttons {
		width: 84px;
		flex: 0 0 84px;
		.ask-button {
			font-size: 1.2rem;
			min-width: auto;
			padding: 4px 12px;
			color: map-get($color, 100);
			border-radius: 2px;
			background-color: map-get($color, 300S1);
		}
	}
}

</style>
<template>
	<div class="chance winning-codes-box" v-if="show">
		<div class="codes">
			中奖号码:
			<template v-if="currentPrize.lev == 1">
				<template v-for="(i,$i) in lotteryMain.lotteryOpen">
					<template v-if="lotteryMain.lotteryOpen[$i] == 1"><em>{{codes[0].substr($i,1)}}</em></template>
					<template v-else><em>?</em></template>
				</template>
			</template>
			<!-- <template v-if="currentPrize.lev == 1 && lotteryMain.lotteryStop">
				<template v-for="(wc,$wc) in codes">
					<template v-if="$wc <= 3">
						<template v-if="($wc+1) == codes.length || $wc == 3">
							<em v-text="wc" :key="$wc"></em>
						</template>
						<template v-else>
							<em v-text="wc" :key="$wc"></em>、
						</template>
					</template>
				</template>
			</template> -->
			<template v-if="currentPrize.lev != 1">
				<template v-for="(wc,$wc) in codes">
					<template v-if="$wc <= 3">
						<template v-if="($wc+1) == codes.length || $wc == 3">
							<em v-text="wc" :key="$wc"></em>
						</template>
						<template v-else>
							<em v-text="wc" :key="$wc"></em>、
						</template>
					</template>
				</template>
			</template>
		</div>
		<div class="buttons" v-if="codes.length > 3">
			<ask-button @ask-click="onClick">
				<span class="button-text" v-text="'更多中奖号'">
				</span>
			</ask-button>
		</div>
	</div>
</template>
<script>
export default {
	name: "winning-codes",
	inject: ['lotteryMain'],
	props: ['show', 'codes', 'currentPrize'],
	created(){
		// console.log(this.codes.length);
	},
	methods:{
		onClick(){
			// console.log(this.lotteryMain.luck)
			window.location.href = this.lotteryMain.luck.detail;
		}
	}
}

</script>
