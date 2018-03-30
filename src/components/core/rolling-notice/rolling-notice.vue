<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.rolling-notice-box {
	width: 100%;
	@include flexLayout(flex, normal, center);
	padding: 10px 6px;
	.rn-horn {
		flex: 0 0 auto;
		width: 30px;
		text-align: center;
		.iconfont {
			font-size: 1.8rem;
			color: map-get($color, 500);
		}
	}
	.rn-body {
		width: calc(100% - 30px);
		flex: 1 0 auto;
		.rn-box {
			width: 100%;
			height: 20px;
			overflow: hidden;
			ul {
				width: 100%;
				&.rolling {
					animation: rolling-move 3s infinite linear;
				}
				li {
					width: 100%;
					color: map-get($color, 500);
					font-size: 1.4rem;
					line-height: 20px;
					word-break: break-all;
					em {
						color: map-get($color, 100);
						font-style: normal;
						margin: 0;
					}
				}
			}
		}
	}
}

@keyframes rolling-move {
	0% {
		transform: translateY(0px);
	}
	100% {
		transform: translateY(-50%);
	}
}

</style>
<template>
	<div class="rolling-notice-box">
		<div class="rn-horn">
			<i class="iconfont icon-laba"></i>
		</div>
		<div class="rn-body">
			<div class="rn-box" v-if="list && list.length > 0">
				<ul ref="rollingEl" :style="style">
					<template v-for=" (i,$i) in list">
						<li :key="$i" v-text="i.value"></li>
					</template>
					<template v-for=" (i,$i) in list">
						<li :key="$i" v-text="i.value"></li>
					</template>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: "rolling-notice",
	props: ['list'],
	data() {
		return {
			style: {},
			rolling: false
		}
	},
	mounted() {
		this.initRolling();
	},
	methods: {
		initRolling() {
			this.$nextTick(function() {
				if (this.list.length == 0) return;
				this.$refs.rollingEl.classList.remove('rolling');
				let duration = parseInt(this.$refs.rollingEl.clientHeight / 20, 10);
				this.style = { "animation-duration": duration + 's' };
				this.$refs.rollingEl.classList.add('rolling');
			})
		}
	},
	watch: {
		list: {
			handler: function(n, o) {
				this.initRolling();
			},
			deep: true
		}
	}
}

</script>
