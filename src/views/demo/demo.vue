<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.demo {
	height: 100%;
	.chc-send {
		position: absolute;
		height: 54px;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1400;
	}
}

.ask-slide-modal {
	height: calc(100% - 54px);
}

.index-tab {
	@include flexLayout(flex, normal, center);
	background-color: map-get($askTab, 300);
	.ask-tab {
		max-width: calc(100% - 90px);
	}
	.ask-nav-more {
		flex: 0 0 auto;
		white-space: nowrap;
		text-align: right;
		.ask-button {
			min-width: auto;
			width: auto;
			color: map-get($color, 500);
			font-size: 1.4rem;
			padding: 6px 8px;
			.iconfont {
				font-size: 1.4rem;
			}
		}
	}
}

</style>
<template>
	<!-- <div class="demo">
		<div class="index-tab">
			<ask-tab>
				<ask-tab-nav @on-click="onClick" :selected="defaultActive == 0">
					聊天
				</ask-tab-nav>
				<ask-tab-nav @on-click="onClick" :selected="defaultActive == 1">
					爆款
				</ask-tab-nav>
			</ask-tab>
			<ask-nav-more>
				更多服务
			</ask-nav-more>
		</div>
		<ask-swiper class="ask-slide-modal" :options="swoptions">
			<ask-slide>
				<chat-component :show="defaultActive == 0" :newmsg="newmsg" @img-change="onChange" :previewer="$refs.previewer"></chat-component>
			</ask-slide>
			<ask-slide>
				<explosive-goods :show="defaultActive == 1"></explosive-goods>
			</ask-slide>
		</ask-swiper>
		<ask-previewer :list="loadImg" ref="previewer" :options="options"></ask-previewer>
		<chat-send class="chc-send" v-show="defaultActive == 0" @sendback="onUpdate"></chat-send>
	</div> -->
	<div class="demo">
		<ask-button></ask-button>
		<ask-button></ask-button>
		<ask-button></ask-button>
		<input name="uploadfile" id="picture_input" @change="onChange($event)" type="file" accept="image/*">
	</div>
</template>
<script>
import EXIF from "exif-js";
import chatComponent from '@core/chat-component/chat-component.vue';
import explosiveGoods from '@core/explosive-goods/explosive-goods.vue';
import chatSend from '@core/chat-component/chat-send.vue';
export default {
	name: "demo",
	components: {
		'chat-component': chatComponent,
		'explosive-goods': explosiveGoods,
		"chat-send": chatSend,
	},
	computed: {
		options() {
			return {
				getThumbBoundsFn(index) {
					// find thumbnail element
					let thumbnail = document.querySelectorAll('.chat-picture>img')[index]
					// get window scroll Y
					let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
					// optionally get horizontal scroll
					// get position of element relative to viewport
					let rect = thumbnail.getBoundingClientRect();

					// w = width
					return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
					// Good guide on how to get element coordinates:
					// http://javascript.info/tutorial/coordinates
				}
			}
		},
		swoptions() {
			return {
				onInit: function(swiper) {
					this.defaultActive = swiper.activeIndex;
					this.swiper = swiper;
				}.bind(this),
				onSlideChangeStart: function(swiper) {
					this.defaultActive = swiper.activeIndex;
				}.bind(this)
			}
		}
	},
	data() {
		return {
			defaultActive: 0,
			loadImg: [],
			newmsg: null,
			swiper: null
		}
	},
	mounted() {},
	methods: {
		onClick(index) {
			this.defaultActive = index;
			this.swiper.slideTo(index);
		},
		onUpdate(msg) {
			this.newmsg = msg;
		},
		onChange(e) {
			Array.prototype.slice.call(e.target.files).map(index => {
				let formData = new FormData();
				formData.append("name", "uploadfile");
				formData.append("type", "image");
				formData.append("makethumb", 1);
				formData.append("thumbparam", '{"maxWidth":120,"maxHeight":120,"scale":true,"inflate":true}');
				// formData.append("uploadfile", index);
				let orientation, self = this;
				EXIF.getData(index, function() {
					orientation = EXIF.getTag(this, "Orientation");
					let canvas = document.createElement('canvas'),
						ctx = canvas.getContext('2d');
					// if (!window.FileReader) return;
					// let reader = new FileReader();
					// reader.readAsDataURL(index);
					let URL = window.URL || window.webkitURL;
					if(!URL) return;
					let fileURL = URL.createObjectURL(index);
					// reader.onloadend = function(){
					// let result = this.result;  
					let img = new Image();
					let drawWidth,drawHeight,degree = 0;
					img.src = fileURL;
					img.onload = function() {
						canvas.width = drawWidth = img.width;
						canvas.height = drawHeight = img.height;
						alert(orientation);
						switch (orientation) { //横屏竖屏转化  
							//横屏拍摄，此时home键在左侧  
							case 3:
								degree = 180;
								drawWidth = -drawWidth;
								drawHeight = -drawHeight;
								break;
								//竖屏拍摄，此时home键在下方(正常拿手机的方向)  
							case 6:
								canvas.width = drawHeight;
								canvas.height = drawWidth;
								degree = 90;
								drawWidth = drawWidth;
								drawHeight = -drawHeight;
								break;
								//竖屏拍摄，此时home键在上方  
							case 8:
								canvas.width = drawHeight;
								canvas.height = drawWidth;
								degree = 270;
								drawWidth = -drawWidth;
								drawHeight = drawHeight;
								break;
						}
						//使用canvas旋转校正  
						ctx.rotate(degree * Math.PI / 180);
						ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
						document.body.appendChild(canvas);
						let base64 = canvas.toDataURL('image/jpeg');
						formData.append("uploadfile", base64);
					}
					// }
				})
			});
		}
	}
}

</script>
