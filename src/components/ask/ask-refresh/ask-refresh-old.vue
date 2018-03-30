<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.ask-refresh {
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;
	.ask-refresh-box {
		width: 100%;
		height: 100%;
		position: relative;
		&.bound {
			transition: .3s ease transform;
		}
		.text {
			font-size: 1.4rem;
			text-align: center;
			color: rgba(map-get($color, 400S2), .8);
			padding: 10px 0;
			position: relative;
		}
	}
	.ask-rfheader {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 1;
		transform: translate3d(0, -100%, 1px);
	}
	.ask-rffooter {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 1;
		transform: translate3d(0, 100%, 1px);
		.ask-refresh-lodaer {
			margin-top: 0px;
		}
	}
	.ask-rfbody {
		width: 100%;
		height: 100%;
		position: relative;
		overflow-y: auto;
		&::-webkit-scrollbar {
			width: 2px;
			background-color: transparent;
		}
		&::-webkit-scrollbar-track {
			border-radius: 0;
			background-color: map-get($scrollbar, 600);
			-webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, .2);
			box-shadow: inset 0 0 3px rgba(0, 0, 0, .2);
		}
		&::-webkit-scrollbar-thumb {
			border-radius: 4px;
			background-color: rgba(map-get($scrollbar, 200), .4);
		}
		&::-webkit-scrollbar-thumb:hover {
			background-color: rgba(map-get($scrollbar, 200), .6);
		}
		&::-webkit-scrollbar-thumb:active {
			background-color: rgba(map-get($scrollbar, 200), 1);
		}
	}
	.ask-refresh-lodaer {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		@include flexLayout(flex, center, center);
		transform: translate(0, -50%);
		z-index: 2;
		margin-top: -20px;
		&>div {
			font-size: 1.8rem;
			font-weight: 900;
			margin: 0 2px;
			&:nth-child(3n+1) {
				color: map-get($loader, 100);
				animation: ask-loader-bounce 1.2s ease-in-out infinite;
			}
			&:nth-child(3n+2) {
				color: map-get($loader, 200);
				animation: ask-loader-bounce 1.2s .2s ease-in-out infinite;
			}
			&:nth-child(3n+3) {
				color: map-get($loader, 500);
				animation: ask-loader-bounce 1.2s .6s ease-in-out infinite;
			}
			&:nth-child(3n+4) {
				color: map-get($loader, 600);
				animation: ask-loader-bounce 1.2s .8s ease-in-out infinite;
			}
		}
	}
}

@keyframes ask-refresh-lodaer-bounce {
	0%, 100% {
		transform: translateY(10px) scaleY(.8) translateZ(0);
	}
	80% {
		transform: translateY(2px) scaleY(1.02) translateZ(0);
	}
}

</style>
<template>
	<div class="ask-refresh" 
		@touchstart="touchStart($event)" 
		@touchmove="touchMove($event)" 
		@touchend="touchEnd($event)" >
		<div class="ask-refresh-box" :style="style" :class="{bound:bound}">
			<div class="ask-rfheader" v-show="downShow">
				<div class="text" v-show="downState == 0">松开刷新数据</div>
				<div class="text" v-show="downState == 1">
					<div class="ask-refresh-lodaer">
						<div>A</div>
						<div>S</div>
						<div>K</div>
					</div>
				</div>
				<div class="text" v-show="downState == 2">{{downTip}}</div>
			</div>
			<div class="ask-rfbody" @scroll="onScroll($event)">
				<slot></slot>
			</div>
			<div class="ask-rffooter" v-show="upwardShow">
				<div class="text" v-show="upwardState == 0">上拉刷新</div>
				<div class="text" v-show="upwardState == 1">
					<div class="ask-refresh-lodaer">
						<div>A</div>
						<div>S</div>
						<div>K</div>
					</div>
				</div>
				<div class="text" v-show="upwardState == 2">{{upwardTip}}</div>
			</div>
		</div>
	</div>
</template>
<script>
const DURATION = 2000,
	RUNRANGE = 40;
export default {
	name: "ask-refresh",
	props: {
		mode: {
			type: Number,
			default: 0 //0->不触发上拉下拉函数,1->仅开启下拉，2->仅开启上拉,3->上拉下拉开启
		},
		downRef: {
			type: String,
			default: null //null不会使用这个值，START->开始,ON->进行中,OVER->完成
		},
		downTip:{
			type: String,
			default:'加载完成'
		},
		upwardRef: {
			type: String,
			default: null //null不会使用这个值，START->开始,ON->进行中,OVER->完成
		},
		upwardTip:{
			type: String,
			default:'加载完成'
		},
		slideBottom: {
			type: Boolean,
			default: false //ask-refresh模块默认滑动到顶部，false->顶部,true->底部
		},
		slideRef: {
			type: String,
			default: null //null不会使用这个值，START->开始,ON->进行中,OVER->完成
		}
	},
	computed: {
		style() {
			return { transform: `translate3d(0,${this.bodyMove}px,0)` }
		}
	},
	data() {
		return {
			start: {
				x: 0,
				y: 0,
				move: 0 //每次touch事件需要获取body移动距离
			},
			allowScroll: false, //是否允许触发touchmove
			bodyMove: 0, //body内容需要移动的距离
			bound: false, //是否增加回弹过渡效果
			downShow: false, //控制下拉内容的展示
			downState: 0, //控制下拉内容模块的展示
			downTimer: null, //下拉timer
			upwardOnly: true, //控制上拉是否需要是否只有一个存在
			upwardShow: false, //控制上拉内容的展示
			upwardState: 0, //控制上拉内容模块的展示
			upwardTimer: null, //上拉timer
			domJustOne: 0, //上拉timer
			scrollStart: 0, //滚动条初始化位置
			bottomStart: 0 //滑动到底部tag标记
		}
	},
	mounted() {
		this.$nextTick(() => {
			if (this.slideBottom && this.slideRef == 'OVER') {
				let bodyEl = this.bodyElement();
				bodyEl.scrollTop = bodyEl.scrollHeight;
			}
		})
	},
	methods: {
		touchStart(e) {
			let start = this.touchPosition(e);
			this.start.x = start.x;
			this.start.y = start.y;
			this.start.move = this.bodyMove;
			this.allowScroll = true;
			this.bound = false;
			this.scrollStart = this.bodyElement().scrollTop;
			//根据上拉模块是否显示判断当前上拉是否唯一
			if (!this.upwardShow) {
				this.upwardOnly = true;
			}
			// console.log('start->x:',this.start.x,'y:',this.start.y,'move:',this.start.move );
		},
		touchMove(e) {

			if (!this.allowScroll) return;

			let bodyEl = this.bodyElement();
			const move = this.touchPosition(e);
			const diff = {
				x: move.x - this.start.x,
				y: move.y - this.start.y,
			}
			let _bodyMove = this.start.move + diff.y + bodyEl.scrollTop - this.scrollStart;

			//下拉开始执行的条件
			if (this.mode == 1 || this.mode == 3) {
				if (bodyEl.scrollTop <= 0 && _bodyMove >= 0) {
					if (e.preventDefault) e.preventDefault();
					else e.returnValue = false;
					this.bodyMove = _bodyMove;
					if (!this.downShow) {
						//显示下拉tip模块
						this.downShow = true;
					}
				} else {
					this.bodyMove = 0;
				}
			}
			//上拉开始执行的条件
			if (this.mode == 2 || this.mode == 3) {
				//如果页面上拉tip存在则直接返回
				let height = bodyEl.scrollHeight - bodyEl.clientHeight;
				//上拉到底，触发tip显示
				if (bodyEl.scrollTop >= height && _bodyMove < 0) {

					if (e.preventDefault) e.preventDefault();
					else e.returnValue = false;
					this.bodyMove = _bodyMove;

					if (!this.upwardOnly) return;
					if (!this.upwardShow) {
						//显示上拉tip模块
						this.upwardShow = true;
					}
					if (this.upwardShow) {
						//上拉超出预定范围则执行上拉函数
						if (-this.bodyMove >= RUNRANGE + 10) {
							this.upwardState = 1;
							this.upwardOnly = false;
							//根据父组件传递状态判断执行条件
							if (this.upwardRef != null && this.upwardRef == 'ON' || this.upwardRef == 'OVER') return;
							if (this.upwardRef != null && this.upwardRef == 'START') {
								this.$emit('upward');
								return;
							}
							//如果父组件未传递执行条件，则在默认延迟后消失
							if (this.upwardTimer) return;
							this.$emit('upward');
							this.upwardTimer = setTimeout(() => {
								if (this.upwardRef == null) {
									this.upwardState = 2;
									setTimeout(() => {
										 let bodyEl = this.bodyElement();
										 this.upwardShow = false;
										 this.upwardState = 0;
										 this.bodyMove = 0;
									},500);
								}
								clearTimeout(this.upwardTimer);
								this.upwardTimer = null;
							}, DURATION);
						}
					}
				}
			}
		},
		touchEnd(e) {
			this.allowScroll = false;
			// 下拉过界
			if (this.bodyMove >= 0) {
				this.bound = true;
				//下拉超出预定范围则执行下拉函数
				if (this.bodyMove < RUNRANGE) {
					this.bodyMove = 0;
					return;
				}
				if (this.mode == 1 || this.mode == 3) {
					this.downState = 1;
					this.bodyMove = RUNRANGE;
					//根据父组件传递状态判断执行条件
					if (this.downRef != null && this.downRef == 'ON' || this.downRef == 'OVER') return;
					if (this.downRef != null && this.downRef == 'START') {
						this.$emit('down');
						return;
					}
					//如果父组件未传递执行条件，则在默认延迟后消失
					if (this.downTimer) return;
					this.$emit('down');
					this.downTimer = setTimeout(() => {
						if (this.downRef == null) {
							this.downState = 2;
							setTimeout(() => {
								this.downShow = false;
								this.downState = 0;
								this.bodyMove = 0;
							},500);
						}
						clearTimeout(this.downTimer);
						this.downTimer = null;
					}, DURATION);
				} else {
					this.bodyMove = 0;
				}
			}

			//上拉过界
			let bodyEl = this.bodyElement();
			let height = bodyEl.scrollHeight - bodyEl.clientHeight;

			if (bodyEl.scrollTop >= height && this.bodyMove < 0) {
				this.bound = true;
				this.bodyMove = 0;
				bodyEl.scrollTop = bodyEl.scrollHeight;
				if (this.upwardState == 1 || this.upwardState == 2) {
					this.bodyMove = -(RUNRANGE + 10);
				}
			}
		},
		touchPosition(e) {
			e = e.originalEvent || e;

			if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend') {
				return {
					x: e.targetTouches[0].pageX,
					y: e.targetTouches[0].pageY
				};
			} else {
				return {
					x: e.pageX,
					y: e.pageY
				};
			}
		},
		bodyElement() {
			let bodyEl = Array.prototype.slice.call(this.$el.querySelector('.ask-refresh-box').children).filter(index => index.className.indexOf('ask-rfbody') == 0);
			return bodyEl[0];
		},
		onScroll(e){
			let el = e.target;
			if(el.scrollTop == el.scrollHeight - el.clientHeight){
				this.bottomStart = 0;
			}else{
				this.bottomStart = 1;
			}
		}
	},
	watch: {
		'downRef' (n, o) {
			if (n == 'OVER') {

				let bodyEl = this.bodyElement();
				let d = bodyEl.scrollHeight - this.scrollStart;
				this.downState = 2;
				setTimeout(() => {
					bodyEl.scrollTop = bodyEl.scrollHeight - d - 100;
					this.downShow = false;
					this.downState = 0;
					this.bodyMove = 0;
				},500);
			}
		},
		'upwardRef' (n, o) {
			if (n == 'OVER') {
				this.upwardState = 2;
				setTimeout(() => {
					 this.upwardShow = false;
					 this.upwardState = 0;
					 this.bodyMove = 0;
				},500);
			}
		},
		'slideRef' (n, o) {
			//思路 利用onscroll来实现
			if (this.slideBottom && n == 'OVER') {
				this.$nextTick(() => {
					let bodyEl = this.bodyElement();
					if(this.bottomStart == 0){
						bodyEl.scrollTop = bodyEl.scrollHeight;
					}
				})
			}
		}
	}
}

</script>
