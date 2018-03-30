<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.chc-once.own {
	.chat-voice-box {
		flex-flow: row-reverse nowrap;
		.chat-voice {
			background-color: map-get($color, 400S1);
			border-radius: 8px 0px 8px 8px;
			.button-text {
				&>div {
					background-color: map-get($color, 300);
				}
			}
		}
		.chat-voice-length {
			padding-left: 0px;
			padding-right: 6px;
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
		background-color: map-get($color, 800S1);
		border-radius: 0 8px 8px 8px;
		margin: 5px 0;
		.button-text {
			@include flexLayout(flex, normal, center);
			height: 24px;
			&>div {
				width: 4px;
				height: 24px;
				border-radius: 2px;
				background-color: map-get($color, 700);
				margin: 0 2px;
				transition: all .3s linear;
				&:nth-child(1) {
					transform: scaleY(.5);
				}
				&:nth-child(2) {
					transform: scaleY(.8);
				}
				&:nth-child(3) {
					transform: scaleY(1);
				}
				&:nth-child(4) {
					transform: scaleY(.8);
				}
				&:nth-child(5) {
					transform: scaleY(.5);
				}
			}
			&.play {
				&>div:nth-child(1) {
					animation: voice-play 1s linear infinite both alternate;
				}
				&>div:nth-child(2) {
					animation: voice-play 1s .5s linear infinite both alternate;
				}
				&>div:nth-child(3) {
					animation: voice-play 1s 1s linear infinite both alternate;
				}
				&>div:nth-child(4) {
					animation: voice-play 1s .5s linear infinite both alternate;
				}
				&>div:nth-child(5) {
					animation: voice-play 1s linear infinite both alternate;
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
	}
}

@keyframes voice-play {
	to {
		transform: scaleY(.5);
	}
	from {
		transform: scaleY(1);
	}
}

</style>
<template>
	<div class="chat-voice-box">
		<ask-button :hover="false" class="chat-voice" @ask-click="voiceControll" :style="style">
			<span class="button-text" :class="{play: playing}">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</span>
		</ask-button>
		<div class="chat-voice-length">{{length}}''</div>
		<audio v-bind:id="playerId" ref="audiofile" :src="voiceSrc" preload="auto" style="display:none;"></audio>
	</div>
</template>
<script>
import { chatVoice, removeChatVoice } from './chat-voice.js';
import bgm from './chat-test.mp3';
import { Chat } from '@/services';
export default {
	name: "chat-voice",
	inject: ['chatMain'],
	props: ['length', 'url'],
	computed: {
		style() {
			return { width: this.length / 2 + 52 + 'px' };
		},
		playerId(){
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
	async mounted(){
		this.audio = this.$refs.audiofile;
		if(this.voiceSrc == null){
			const chatServer = new Chat();
			await chatServer.amrToMp3(this.url).then(r => {
				this.chatMain.setVoiceTimer(this.playerId);
				this.voiceSrc = r.data.url;
				this.$nextTick(()=>{
					this.audio.addEventListener('ended', () => {
						this.stop();
					}, false);
				})
			})
		}
	},
	destroyed(){
	},
	methods:{
		voiceControll(){
			if(this.chatMain.voiceTimer != this.playerId){
				this.chatMain.setVoiceTimer(this.playerId);
			}
			if(this.playing){
				this.stop();
			}else{
				this.play();
			}
		},
		play(){
			if (this.playing) return;
			this.audio.src= this.voiceSrc;
			this.audio.play();
			this.playing = true;
		},
		stop(){
			if(!this.playing) return;
			this.audio.src= "";
			this.audio.pause();
			this.playing = false;
		}
	},
	watch:{
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
