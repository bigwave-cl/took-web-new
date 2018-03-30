<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.chat-component-box {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
	.chc-box {
		width: 100%;
		height: calc(100% - 54px);
		position: relative;
		.chc-list {
			width: 100%;
			padding: 0 4px;
			.chc-once {
				width: 100%;
				@include flexLayout(flex, normal, normal);
				padding: 4px 0;
				.cover {
					width: 14%;
					max-width: 48px;
					.box {
						width: 100%;
						padding: 50% 0;
						position: relative;
						border-radius: 100%;
						overflow: hidden;
						&>img {
							width: 100%;
							height: 100%;
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							border-radius: 100%;
							overflow: hidden;
						}
					}
				}
				.info {
					flex: 1 0 auto;
					width: 86%;
					max-width: calc(100% - 48px);
					padding-left: 4px;
					.name {
						width: 100%;
						white-space: nowrap;
						font-size: 0;
						letter-spacing: 0;
						span {
							font-size: 1.2rem;
							display: inline-block;
							color: map-get($color, 400S1);
							max-width: calc(100% - 50px);
							@include textEllipsis(1);
							&.tag {
								max-width: 50px;
								padding: 0 4px;
								background-color: map-get($color, 800S1);
								border-radius: 2px;
								color: map-get($color, 200);
								margin: 0 2px;
								&.main {
									background-color: map-get($color, 300D1);
								}
							}
						}
					}
					.msg {
						width: 100%;
						.box {
							display: inline-block;
							max-width: 100%;
							word-break: break-all;
							padding: 10px 16px;
							border-radius: 0 8px 8px 8px;
							background: green;
							margin: 4px 0;
							font-size: 1.4rem;
							line-height: 1.8rem;
							color: map-get($color, 400D3);
							/* background: linear-gradient(to bottom, map-get($color, 900), map-get($color, 900S1)); */
							background: map-get($color, 200);
							a {
								color: map-get($color, u200);
								text-decoration: none;
							}
						}
					}
				}
				&.own {
					@include flexLayout(flex, normal, normal);
					flex-flow: row-reverse nowrap;
					.info {
						text-align: right;
						padding-left: 0;
						padding-right: 4px;
						.msg {
							.box {
								border-radius: 8px 0px 8px 8px;
								background: map-get($color, u100);
								color: map-get($color, 400D3);
							}
						}
					}
				}
			}
		}
	}
}

</style>
<template>
	<div class="chat-component-box" v-show="show">
		<div class="chc-box">
			<ask-scroll :on-refresh="onRefresh" :chat="true">
				<template slot="refresh" v-if="!refreshEnd">
					<scroll-before>下拉刷新</scroll-before>
					<scroll-loosen>松开刷新</scroll-loosen>
					<scroll-in>
						<div class="ask-refresh-lodaer">
							<div>A</div>
							<div>S</div>
							<div>K</div>
						</div>
					</scroll-in>
					<scroll-end>刷新成功</scroll-end>
				</template>
				<template slot="refresh" v-else>
					<div>已全部加载</div>
				</template>
				<ul class="chc-list">
					<template v-for="(m,$i) in message">
						<li class="chc-once" :key="$i" :class="{own:m.own}">
							<div class="cover">
								<div class="box">
									<img :src="m.thumb_pic" alt="头像">
								</div>
							</div>
							<div class="info">
								<div class="name">
									<span v-text="m.name"></span>
									<template v-if="m.role == 1">
										<span class="tag main">群主</span>
									</template>
									<template v-if="m.role == 2">
										<span class="tag">管理员</span>
									</template>
								</div>
								<div class="msg">
									<template v-if="m.msg.type == 1">
										<div class="box" v-html="httpHtml(m.msg.content)"></div>
									</template>
									<template v-if="m.msg.type == 2">
										<chat-voice :length="m.msg.length" :url="m.msg.audiourl">
										</chat-voice>
									</template>
									<template v-if="m.msg.type == 3">
										<div class="box">
											<chat-picture :id="m.msgid" :thumb="m.msg.thumburl" :picture="m.msg.picurl" @loadBack="loadBack">
											</chat-picture>
										</div>
									</template>
								</div>
							</div>
						</li>
					</template>
				</ul>
			</ask-scroll>
		</div>
	</div>
</template>
<script>
import chatPicture from './chat-picture.vue';
import chatVoice from './chat-voice.vue';
import channel from '@/components/channel.js';
import { Chat } from '@/services';
let CHAT_NEW_TIMER = null;
export default {
	name: "chat-component",
	props: ['show', 'newmsg', "previewer"],
	components: {
		"chat-picture": chatPicture,
		"chat-voice": chatVoice,
	},
	provide() {
		return {
			chatMain: this
		}
	},
	data() {
		return {
			loadImgLength: 0,
			loadImg: [],
			message: [],
			refreshEnd: false,
			voiceTimer: null,
			needSlide: true
		}
	},
	async created() {

		if (this.show) {
			await this.initMessage();
		}
	},
	methods: {
		setVoiceTimer(timer) {
			this.voiceTimer = timer;
		},
		setLoadImg(img, id, isReverse) {
			let src = img.picurl;
			let srcSize = src.split("?size=")[1];
			if (srcSize) {
				let _s = srcSize.split('x');
				let once = {
					src: src,
					w: _s[0],
					h: _s[1],
					id: id
				}
				if (isReverse) {
					this.loadImg.unshift(once);
				} else {
					this.loadImg.push(once);
				}
			} else {

				let once = {
					src: src,
					w: 1080,
					h: 1920,
					id: id
				}

				if (isReverse) {
					this.loadImg.unshift(once);
				} else {
					this.loadImg.push(once);
				}

				let imgDom = new Image(); // 创建img元素
				imgDom.onload = () => {
					let index = this.loadImg.findIndex(p => p.id == id);
					this.loadImg[index].w = imgDom.width;
					this.loadImg[index].h = imgDom.height;
				}
				imgDom.src = src;

			}

		},
		initMessage() {
			this.needSlide = true;
			const chatServer = new Chat();
			this.loadImg = [];
			chatServer.message().then(r => {
				this.loadImgLength = 0;
				this.message = [];
				r.data.list.map(index => {
					this.message.push(index);
					if (index.msg.type == 3) {
						this.setLoadImg(index.msg, index.msgid, false);
					}
				})

				if (this.loadImgLength == this.loadImg.length) {
					this.$nextTick(() => {
						this.$children[0].slideToEnd();
						if (CHAT_NEW_TIMER == null) {
							this.cycleUpdateData();
						}
					})
				}
			})
		},
		cycleUpdateData() {
			this.$nextTick(() => {
				let timer = CHAT_NEW_TIMER = setTimeout(() => {
					const chatServer = new Chat();
					chatServer.message().then(r => {
						if (r.data.list.length > 0) {
							const index = r.data.list.findIndex(p => p.msgid == this.message[this.message.length - 1].msgid);
							for (let i = index + 1, l = r.data.list.length; i < l; i++) {
								this.message.push(r.data.list[i]);
								if (r.data.list[i].msg.type == 3) {
									this.setLoadImg(r.data.list[i].msg, r.data.list[i].msgid, false)
								}
							}
						}
						if (this.$children[0].$el.scrollTop >= this.$children[0].$el.scrollHeight - this.$children[0].$el.clientHeight) {
							this.needSlide = true;
						} else {
							this.needSlide = false;
						}
						this.$nextTick(() => {
							clearTimeout(timer);
							if (this.loadImgLength == this.loadImg.length && this.needSlide) {
								this.$children[0].slideToEnd();
							}
							if (this.show) {
								this.cycleUpdateData();
							}
						})
					})
				}, 5000);
			})
		},
		onRefresh(done) {
			this.needSlide = false;
			this.refreshEnd = false;
			let opt = {
				new_id: this.message[this.message.length - 1].msgid,
				old_id: this.message[0].msgid,
			}
			const chatServer = new Chat();
			chatServer.oldMessage(opt).then(r => {
				done();
				this.loadImgLength = 0;
				r.data.list.reverse();
				r.data.list.map(index => {
					this.message.unshift(index);
					if (index.msg.type == 3) {
						this.setLoadImg(index.msg, index.msgid, true);
					}
				})
				if (!r.data.hasmore) {
					this.refreshEnd = true;
				}
			}, error => {
				done();
			});
		},
		loadBack() {
			this.loadImgLength++;
		},
		httpHtml: function(value) {
			if (!value) return '';
			value = value.toString();
			let reg = /((https|http|ftp|rtsp|mms)?:\/*\/*)[^\u4E00-\u9FA5]+/g;

			return value.replace(reg, "<a href='$&'>$&</a>");
		}
	},
	watch: {
		loadImg(n) {
			if (n.length > 0) {
				this.$emit('img-change', n);
			}
		},
		loadImgLength(n, o) {
			if (n == this.loadImg.length) {
				this.$nextTick(() => {
					if (this.needSlide) {
						this.$children[0].slideToEnd();
					}
					if (CHAT_NEW_TIMER == null) {
						this.cycleUpdateData();
					}
				})
			}
		},
		show(n, o) {
			if (n) {
				if (this.message.length == 0) {
					this.initMessage();
				}
			} else {
				channel.$emit('channel-voice',{
					state: true,
					name: 'open,from-chat-component'
				});
				CHAT_NEW_TIMER = null;
			}
		},
		newmsg(n, o) {
			this.needSlide = true;
			const chatServer = new Chat();
			chatServer.message().then(r => {
				const index = r.data.list.findIndex(p => p.msgid == this.message[this.message.length - 1].msgid);
				for (let i = index + 1, l = r.data.list.length; i < l; i++) {
					this.message.push(r.data.list[i]);
					if (r.data.list[i].msg.type == 3) {
						this.setLoadImg(r.data.list[i].msg, r.data.list[i].msgid, false);
					}
				}
				if (this.loadImgLength == this.loadImg.length) {
					this.$nextTick(() => {
						this.$children[0].slideToEnd();
					})
				}
			})
		}
	}
}

</script>
