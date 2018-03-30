<template>
	<div class="ask-lottery-animation-box">
		<div class="lottery-pic-bg">
			<div class="lottery-body">
				<div class="lottery-group" v-for="(i,$i) in lottery" :key="$i">
					<div class="number-box" :data-type="$i">
						<ul>
							<li>0</li>
							<li>1</li>
							<li>2</li>
							<li>3</li>
							<li>4</li>
							<li>5</li>
							<li>6</li>
							<li>7</li>
							<li>8</li>
							<li>9</li>
						</ul>
						<ul>
							<li>0</li>
							<li>1</li>
							<li>2</li>
							<li>3</li>
							<li>4</li>
							<li>5</li>
							<li>6</li>
							<li>7</li>
							<li>8</li>
							<li>9</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="lottery-voice">
				<ask-button class="lottery-play" ref="vociceButton" @ask-click="handlerVoiceButton($event)"></ask-button>
			</div>
		</div>
	</div>
</template>
<style src="./ask-lottery-animation.scss" lang="scss"></style>
<script>
import { lotteryKeyframes } from './lottery.keyfrmaes.js';
import { lotteryVoice } from './lottery.voice.js';
import bgm from './luck_bgm.mp3';
import channel from '@/components/channel.js';
import { askDialogToast } from '@/utils';
let ANIMATION_END = false;
export default {
	name:'askLotteryAnimation',
	props: {
		stop:{
			type: Boolean,
			default: false
		},
		lottery: {
			type: Array,
			default: function() {
				return [0, 0, 0, 0];
			}
		},
		codes: {
			type: String,
			default: '0000',
		}
	},
	data() {
		return {
			lotteryRef: [],
			voiceEl: null,
			playing: false,
			isControll: false,
			EventAry:'loadstart,suspend,abort,error,emptied,stalled,loadedmetadata,loadeddata,canplay,canplaythrough,playing,waiting,seeking,seeked,ended,durationchange,timeupdate,progress,play,pause,ratechange,volumechange'.split(',')
		}
	},
	mounted() {
		channel.$on('channel-voice',this.channelVoice);
		ANIMATION_END = false;
		this.voiceEl = lotteryVoice('.lottery-play',bgm);
		this.voiceControll(this.$refs.vociceButton.$el);
		this.EventAry.map(e=>{
			this.voiceEl.addEventListener(e, this.videoEventHandler, false);
		})
		this.initRef();
		this.lottertStart();
		/*if(this.stop) {
			this.voiceControll(this.$refs.vociceButton.$el)
			return;
		}
		this.initRef();
		this.lottertStart();*/
	},
	beforeDestroy: function () {
		channel.$off('channel-voice',this.channelVoice);
	},
	destroyed() {
		this.$nextTick(function() {
			this.playing = false;
			this.voiceEl.pause();
			if(this.voiceEl.remove) this.voiceEl.remove();
		})
	},
	methods: {
		videoEventHandler(event){
			if(event.type == 'stalled' && this.playing){
				this.voiceEl.load();
			}
			if(event.type == 'ended'){
				this.voiceEl.pause();
				el.classList.add('pause');
			}
		},
		channelVoice(data){
			if(!this.voiceEl) return;
			if(data.state){
				this.isControll = false;
				if(this.playing){
					this.voiceEl.play();
				}else{
					this.voiceEl.pause();
				}
			}else{
				this.isControll = true;
				this.voiceEl.pause();
			}
		},
		handlerVoiceButton(el){
			// if(ANIMATION_END) return;
			this.voiceControll(el.target);
		},
		voiceControll(el){
			if(!this.voiceEl) return;
			/*if(!ANIMATION_END && el.classList.contains('pause')){
				el.classList.remove('pause');
				this.voiceEl.play();
			}else{
				this.voiceEl.pause();
				el.classList.add('pause');
			}*/
			if(el.classList.contains('pause')){
				el.classList.remove('pause');
				if(!this.isControll){
					this.voiceEl.play();
				}
				this.playing = true;
			}else{
				if(!this.isControll){
					this.voiceEl.pause();
				}
				el.classList.add('pause');
				this.playing = false;
			}
		},
		initRef() {
			if (this.codes.length < 4) return;
			this.lotteryRef = [];
			for (let i = 0; i < this.codes.length; i++) {
				let cur = {
					value: this.codes.charAt(i),
					state: this.getStateRef(this.lottery[i])
				};

				this.lotteryRef.push(cur);
			}
		},
		getStateRef(val) {
			let _state = '';
			switch (val) {
				case 0:
					_state = 'START'
					break;
				case 1:
					_state = 'END'
					break;
				case 2:
					_state = 'OVER'
					break;
				default:
					_state = 'START'
			}
			return _state;
		},
		updateState() {
			this.lottery.map((key, index) => {
				if (key === 1 && this.lotteryRef[index].state === 'START') {
					this.lotteryRef[index].state = this.getStateRef(key);
				}
			})
		},
		isOver() {
			let result = this.lottery.filter(index => index == 1);
			if (result.length === this.lottery.length) return true;
			return false;
		},
		lottertStart() {
			let numberEl = this.$el.querySelectorAll('.lottery-group');
			let numberElArray = Array.prototype.slice.call(numberEl);
			numberElArray.map(index => {
				lotteryKeyframes(index.querySelector('.number-box'), 'run');
			})
			this.lottertProcess();
		},
		lottertProcess() {
			/*
			抽奖结果更新
			更新结果包含以前更新过马上需要更新的
			以前更新的不管
			现在更新的马上执行end
			 */
			let numberEl = this.$el.querySelectorAll('.lottery-group');
			let numberElArray = Array.prototype.slice.call(numberEl);
			this.updateState();
			numberElArray.map(index => {
				let cur = index.querySelector('.number-box');
				let _lindex = cur.getAttribute('data-type');
				if (this.lotteryRef[_lindex].state === 'END') {
					lotteryKeyframes(cur, 'end', this.lotteryRef[_lindex].value, () => {
						this.lotteryRef[_lindex].state = this.getStateRef(2);
						this.animationOver();
					});
				}
			})
		},
		lottertEnd() {
			ANIMATION_END = true;
			// this.voiceControll(this.$el.querySelector('.lottery-play'));
			this.$emit('callback');
		},
		animationOver() {
			let result = this.lotteryRef.filter(index => index.state === this.getStateRef(2));
			if (result.length === this.lotteryRef.length) {
				this.lottertEnd();
			}
		}
	},
	watch: {
		'lottery': {
			handler: function(n, o) {
				if(this.stop || this.lotteryRef.length != 4) return;
				this.lottertProcess();
			},
			deep: true
		},
		"codes"(n,o){
			if(this.stop) return;
			this.initRef();
			this.lottertStart();
		}
	}
}

</script>
