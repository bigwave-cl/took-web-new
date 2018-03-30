<style src="./index.scss" lang="scss"></style>
<template>
	<div class="took-container">
		<lottery-home></lottery-home>
		<div class="index-tab">
			<ask-tab>
				<ask-tab-nav @on-click="onClick" :selected="defaultActive == 0">
					聊天
				</ask-tab-nav>
				<ask-tab-nav @on-click="onClick" :selected="defaultActive == 1">
					爆款
				</ask-tab-nav>
			</ask-tab>
			<ask-nav-more @click.native="onMoreClick">
				更多服务
			</ask-nav-more>
		</div>
		<ask-swiper class="ask-slide-modal" :options="swoptions">
			<ask-slide>
				<chat-component 
					:show="defaultActive == 0" 
					:newmsg="newmsg" 
					@img-change="onChange" 
					:previewer="$refs.previewer">
				</chat-component>
			</ask-slide>
			<ask-slide>
				<explosive-goods :show="defaultActive == 1"></explosive-goods>
			</ask-slide>
		</ask-swiper>
		<ask-previewer :list="loadImg" ref="previewer" :options="options"></ask-previewer>
		<chat-send class="chc-send" v-show="defaultActive == 0" @sendback="onUpdate"></chat-send>
	</div>
</template>
<script>
import lotteryHome from '@core/lottery/lottery-home.vue';
import chatComponent from '@core/chat-component/chat-component.vue';
import explosiveGoods from '@core/explosive-goods/explosive-goods.vue';
import chatSend from '@core/chat-component/chat-send.vue';

export default {
	name: 'home',
	inject: ['rootMain'],
	components: {
		'lottery-home': lotteryHome,
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
	methods: {
		onClick(index) {
			this.defaultActive = index;
			this.swiper.slideTo(index);
		},
		onUpdate(msg) {
			this.newmsg = msg;
		},
		onChange(imgs) {
			this.loadImg = imgs;
		},
		onMoreClick() {
			this.rootMain.sideslipToggle();
		}
	}
}

</script>
