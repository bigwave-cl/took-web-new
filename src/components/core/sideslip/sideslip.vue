<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';

/* 进入过渡的状态 */

.sideslip-toggle-effect-enter-active {
	animation: sideslip-toggle-enter .3s ease 1 both;
}

.sideslip-toggle-effect-enter-active .sideslip-main {
	animation: sideslip-toggle-main-enter .3s ease 1 both;
}

@keyframes sideslip-toggle-enter {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

@keyframes sideslip-toggle-main-enter {
	0% {
		transform: translate3d(100%, 0, 0);
	}
	100% {
		transform: translate3d(0, 0, 0);
	}
}


/* 离开过渡的状态 */

.sideslip-toggle-effect-leave-active {
	animation: sideslip-toggle-leave .3s cubic-bezier(1.0, 0.5, 0.8, 1.0) 1 both;
}

.sideslip-toggle-effect-leave-active .sideslip-main {
	animation: sideslip-toggle-main-leave .3s cubic-bezier(1.0, 0.5, 0.8, 1.0) 1 both;
}

@keyframes sideslip-toggle-leave {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}

@keyframes sideslip-toggle-main-leave {
	0% {
		transform: translate3d(0, 0, 0);
	}
	100% {
		transform: translate3d(100%, 0, 0);
	}
}

.sideslip-box {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	width: 100vw;
	height: 100vh;
	z-index: 999999;
	.sideslip-overlay {
		width: 100%;
		height: 100%;
	}
	.sideslip-main {
		position: absolute;
		top: 0;
		right: 0;
		width: 62%;
		height: 100%;
		background-color: map-get($color, 200);
		z-index: 5;
		padding: 20px 16px;
		.sideslip-header {
			width: 100%;
			.ask-button {
				padding: 0;
				min-width: 0;
			}
			.close-icon {
				width: 24px;
				height: 24px;
				span {
					display: block;
					position: relative;
					width: 100%;
					height: 100%;
					&::after, &::before {
						content: '';
						display: block;
						width: 100%;
						height: 2px;
						position: absolute;
						top: 50%;
						left: 50%;
						margin: -1px 0 0 -50%;
						pointer-events: none;
						background-color: map-get($color, 400D3);
					}
					&::after {
						transform: rotate(45deg);
					}
					&::before {
						transform: rotate(-45deg);
					}
				}
			}
		}
		.sideslip-body {
			width: 100%;
			padding: 10px 0;
			.ask-button {
				width: 100%;
				min-width: auto;
				padding: 0;
				margin: 4px 0;
			}
			.sideslip-item {
				width: 100%;
				padding: 10px 4px;
				@include flexLayout(flex, normal, center);
				.info {
					max-width: calc(100% - 18px);
					color: map-get($color, 400D3);
					font-size: 1.6rem;
				}
				.icon {
					width: 18px;
					text-align: right;
					margin-left: auto;
					.iconfont {
						font-size: 1.2rem;
						font-weight: 900;
						color: map-get($color, 400D3);
					}
				}
			}
		}
	}
}

</style>
<template>
	<transition name="sideslip-toggle-effect">
		<div class="sideslip-box" v-show="show">
			<div class="sideslip-overlay" @click="close"></div>
			<div class="sideslip-main">
				<div class="sideslip-header">
					<ask-button :hover="false" @ask-click="close">
						<div class="close-icon">
							<span></span>
						</div>
					</ask-button>
				</div>
				<div class="sideslip-body">
					<sideslip-item @ontap="onTap('lotteryDetail','name')">
						奖项详情
					</sideslip-item>
					<sideslip-item @ontap="onTap(url&&url.record,'url')">
						往期记录
					</sideslip-item>
					<sideslip-item @ontap="onTap(url&&url.rule,'url')">
						兑奖规则
					</sideslip-item>
					<sideslip-item @ontap="onTap('lotteryCode','name')">
						我的奖号
					</sideslip-item>
				</div>
				<div class="sideslip-footer"></div>
			</div>
		</div>
	</transition>
</template>
<script>
import sideslipItem from "./sideslip-item.vue";
export default {
	name: "sideslip",
	inject: ['rootMain'],
	components: {
		"sideslip-item": sideslipItem
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		url: {
			type: Object,
			default: {}
		}
	},
	methods: {
		close() {
			this.rootMain.sideslipToggle('close');
		},
		onTap(href, type) {
			if (type == 'name') {
				this.$router.push({ name: href });
			}
			if (type == 'url') {
				window.location.href = href;
			}
		}
	},
	watch: {
		'$route' (to, from) {
			this.close();
		}
	}
}

</script>
