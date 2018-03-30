<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.chc-once.own {
	.chat-voice-box {
		flex-flow: row-reverse nowrap;
		.chat-voice {
			background-color: map-get($color, u100);
			border-radius: 8px 0px 8px 8px;
			.button-text {
				@include flexLayout(flex, right, center);
				&>.cv-rss{
					transform:rotate(180deg);
				}
			}
		}
		.chat-voice-length {
			padding-left: 0px;
			padding-right: 8px;
			&>i{
				right: 6px;
			}
		}
	}
}

.chat-voice-box {
	width: 100%;
	@include flexLayout(flex, normal, center);
	.chat-voice {
		width: auto;
		min-width: 52px;
		max-width: calc(100% - 50px);
		padding: 6px 6px;
		vertical-align: middle;
		/* background-color: map-get($color, 800S1); */
		background-color: map-get($color, 200);
		border-radius: 0 8px 8px 8px;
		margin: 5px 0;
		.button-text {
			@include flexLayout(flex, left, center);
			background-color: inherit;
			&>.cv-rss{
				display: inline-block;
				background-color: inherit;
				font-size: 2.4rem;
				line-height: 1;
				width: 30px;
				height: 24px;
				overflow: hidden;
				position: relative;
				color: map-get($color,u300);
				.iconfont{
					font:inherit;
					color: inherit;
					display: inline-block;
					transform:rotate(180deg);
				}
				&::after{
					content:"";
					display: block;
					width: 10px;
					height: 100%;
					background-color: inherit;
					position: absolute;
					top: 0;
					left: 17px;
					z-index: 4;
					opacity: 0;
				}
				&::before{
					content:"";
					display: block;
					width: 6px;
					height: 100%;
					background-color: inherit;
					position: absolute;
					z-index: 2;
					top: 0;
					left: 11px;
					opacity: 0;
					
				}
			}
			&.play>.cv-rss{
				&::after{
					opacity: 1;
					animation: chat-voice-play-ani 1.2s steps(1,start) infinite;
					animation-delay: .6s;
				}
				&::before{
					animation: chat-voice-play-ani 1.2s steps(2,start) infinite;
				}
			}
		}
	}
	.chat-voice-length {
		white-space: nowrap;
		max-width: 50px;
		font-size: 1.4rem;
		color: map-get($color, 700);
		padding-left: 6px;
		position: relative;
		&>i{
			font-size: 0;
			font-style: normal;
			display: block;
			position: absolute;
			top: 0;
			right: -2px;
			z-index: 2;
			pointer-events:none;
			&::after{
				content:"";
				display: block;
				width: 4px;
				height: 4px;
				border: 1px solid map-get($color, 700);
				border-top: none;
				border-bottom: none;
				position: absolute;
				top: 0;
				left: 0;
			}
		}
	}
}

@keyframes chat-voice-play-ani {
	0% {
		opacity: 0;
	}
	50%{
		opacity: 1;
	}
	100%{
		opacity: 0;
	}
}

</style>
<template>
	<div class="chat-voice-box">
		<ask-button :hover="false" :ripple="false" class="chat-voice" @ask-click="voiceControll" :style="style">
			<span class="button-text" :class="{play: playing}">
				<div class="cv-rss">
					<i class="iconfont icon-rss"></i>
				</div>
			</span>
		</ask-button>
		<div class="chat-voice-length">{{length}}<i></i></div>
		<audio v-bind:id="playerId" ref="audiofile" :src="voiceSrc" preload="auto" style="display:none;"></audio>
	</div>
</template>
<script>
// import bgm from './chat-test.mp3';
import { Chat } from '@/services';
import { askDialogToast } from '@/utils';
import channel from '@/components/channel.js';
export default {
	name: "chat-voice",
	inject: ['chatMain'],
	props: ['length', 'url'],
	computed: {
		style() {
			return { width: this.length / 2 + 52 + 'px' };
		},
		playerId() {
			return 'ask' + Date.now();
		}
	},
	data() {
		return {
			audio: null,
			playing: false,
			voiceSrc: null
		}
	},
	async mounted() {
		channel.$on('chat-voice',()=>{
			if(this.playing){
				this.stop();
			}
		});
		this.audio = this.$refs.audiofile;
		if (this.voiceSrc == null) {
			const chatServer = new Chat();
			await chatServer.amrToMp3(this.url).then(r => {
				this.chatMain.setVoiceTimer(this.playerId);
				this.voiceSrc = r.data.url;
				this.$nextTick(() => {
					this.audio.addEventListener('ended', () => {
						channel.$emit('channel-voice',{
							state: true,
							name: 'open'
						});
						this.stop();
					}, false);
				})
			})
		}
	},
	destroyed() {
		this.audio.removeEventListener('ended', () => {
			channel.$emit('channel-voice',{
				state: true,
				name: 'open'
			});
			this.stop();
		}, false);
	},
	methods: {
		voiceControll() {
			if (this.chatMain.voiceTimer != this.playerId) {
				this.chatMain.setVoiceTimer(this.playerId);
			}
			if (this.playing) {
				channel.$emit('channel-voice',{
					state: true,
					name: 'open'
				});
				this.stop();
			} else {
				channel.$emit('channel-voice',{
					state: false,
					name: 'close'
				});
				this.play();
			}
		},
		play() {
			if (this.playing) return;
			this.audio.src = this.voiceSrc;
			let _play = this.audio.play();
			_play.then(r => {
				this.playing = true;
			}, error => {
				this.playing = false;
				askDialogToast({ msg: `播放失败:${JSON.parse(error)}`, class: "danger", time: 1000 });
			});
		},
		stop() {
			if (!this.playing) return;
			this.audio.pause();
			this.audio.src = "";
			this.playing = false;
		}
	},
	watch: {
		"chatMain.voiceTimer" (n, o) {
			if (this.playerId != n) {
				this.stop();
			}
		},
		"chatMain.show" (n, o) {
			if (!n) {
				this.stop();
			}
		}
	}
}

</script>
