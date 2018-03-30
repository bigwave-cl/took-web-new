<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.chat-send-voice{
	width: 100%;
	height: 100%;
}
.chat-voice-short-modal.ask-modal-box{
	bottom: 54px;
	height: calc(100% - 54px);
	.ask-modal-wrapper{
		width: 154px;
		height: 154px;
		position: relative;
		transform: translateY(30px);
		background-color: rgba(map-get($color,400D1),.5);
		.ask-modal-body{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 0;
			width: 100%;
			height: 100%;
		}

		.voice-record{
			width: 100%;
			height: 100%;
			@include flexLayout(flex, center, center);
			text-align: center;
		}
		.vr-short{
			.vr-sicon{
				font-size: 7.8rem;
				color: map-get($color,200);
				.iconfont{
					font:inherit;
					color: inherit;
				}
			}
			.vr-text{
				padding-top: 4px;
				font-size: 1.6rem;
				color: map-get($color,200);
				white-space: nowrap;
			}
		}
	}
}
</style>
<template>
	<div class="chat-send-voice">
		<ask-button :hover="false" :ripple="false" class="voice-btn"
			:disabled = "$parent.prohibitionSpeech"
			@touchstart.native="touchStart($event)" 
			@touchmove.native="touchMove($event)" 
			@touchend.native="touchEnd($event)"
			@touchcancel.native="touchCancel($event)"  >
			{{voice.text}}
		</ask-button>
		<chat-voice-modal 
			:show="show" 
			:cancelShow="!voice.needUpload" 
			:time="time">
		</chat-voice-modal>
		<ask-modal :show.sync="shortShow"
					:showHeader="false"
					:showFooter="false"
					:shade="0"
					:time="1000"
					:transition="'chat-voice-modal-scale'"
					class="chat-voice-short-modal"
		>
			<div class="voice-record">
				<div class="vr-short">
					<div class="vr-sicon">
						<i class="iconfont icon-gantanhao"></i>
					</div>
					<div class="vr-text">录音时间太短</div>
				</div>
			</div>
		</ask-modal>
	</div>
</template>
<script>
import moment from 'moment/moment.js';
import chatVoiceModal from './chat-voice-modal.vue'
import { askDialogToast,getTransfrom,detectOrient,debounce,isEmptyObject } from '@/utils';
import channel from '@/components/channel.js';
import { WeiXin } from '@/services';

export default {
	name: "ChatSendVoice",
	components:{
		"chat-voice-modal":chatVoiceModal
	},
	data() {
		return {
			voice:{
				localId:"",
				text:'按住说话',
				start: null, //记录开始录音的时间
				recordTime: false, //true代表录制时间足够，false代表录制时间太短
				needUpload: false , //true代表需要上传，false代表不需要上传
			},
			start:{
				x:0,
				y:0
			},
			shortShow:false,
			show:false,
			cancelUploadDistance: 120,
			touching: false,
			time:"00:00",
			timetamp: 0,
			shortTimer:null,
			isrecord: false,
			toas:"",
			countStop: true //倒计时停止，true=>停止，false=>不停止
		}
	},
	mounted() {
		let handleOrientationChange = ()=>{
			if(!this.$wx || !this.show) return;
			detectOrient(()=>{
				this.forceStopRecord();
			},()=>{
				this.forceStopRecord();
			})
		}
		window.onresize = debounce(handleOrientationChange, 300);
		handleOrientationChange();
	},
	destroyed(){
		this.$nextTick(()=>{
			window.onresize = null;
		});
	},
	watch:{
		timetamp(n,o){
			if(this.timetamp == 58){
				this.forceStopRecord();
			}
		}
	},
	methods: {
		touchCancel(e){
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			this.releaseFinger();
			
		},
		touchStart(e) {
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;

			this.shortShow = false;//关闭时间太短提示

			channel.$emit('chat-voice'); //关闭正在播放的语音
			channel.$emit('channel-voice',{ //暂停抽奖音乐
				state: false,
				name: 'close'
			});
			if(this.$wx == void 0) {
				askDialogToast({msg:"微信插件加载失败",class:"danger",time:2000});
				return;
			};

			this.isrecord = true; //tag标记开始录音
			this.touching = true; //touch事件触发
			this.$wx.startRecord({
				success:function(res){
					if(!this.isrecord){ // 如果tag标记为false则代表用户快速点击按钮
						this.shortShow = true; //提示录音时间太短
					    this.$wx.stopRecord();
						return;
					}
					this.start = this.getPosition(e); //记录开始位置
					this.voice.localId = ""; 
					this.voice.start = moment(); //记录开始录音时间
					this.show = true;  //开启正在录音弹窗
					this.voice.needUpload = true; //记录上传状态为true
					this.countStop = false ; //不需要中断倒计时
					this.isrecord = false; //把tag标记为false,表示用户并未迅速点击按钮后松开
					this.timetamp = 0; //录音描述重置为0
					this.countDown(); //开始倒计时
					this.voice.text = '松开结束';
				}.bind(this),
				cancel:function() {
					this.touching = false;
					this.voice.text = '按住说话';
					askDialogToast({msg:"用户拒绝授权录音",class:"danger",time:2000});
					// alert('用户拒绝授权录音');
				}.bind(this),
				fail(res) {
					// askDialogToast({msg:1});
					// askDialogToast({msg:JSON.stringify(res),class:"danger",time:2000});
				}
			});
		},
		touchMove(e) {
			if(!this.touching || this.$wx == void 0) return;

			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			const move = this.getPosition(e);
			const diff = {
				x: move.x - this.start.x,
				y: move.y - this.start.y,
			}
			if(diff.y < 0 &&　Math.abs(diff.y) >= this.cancelUploadDistance ){
				this.voice.needUpload = false;
				this.voice.text = '松开手指，取消发送';
			}else{
				this.voice.needUpload = true;
				this.voice.text = '松开结束';
			}
		},
		touchEnd(e) {
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			this.releaseFinger();
		},
		releaseFinger(){
			channel.$emit('channel-voice',{ //重新播放抽奖音乐
				state: true,
				name: 'open'
			});
			if(this.$wx == void 0 || !this.touching) return; 

			this.voice.text = '按住说话';
			this.show = false; //关闭录音弹窗
			this.touching = false; //touch事件结束
			this.countStop = true; // 中断倒计时
			this.shortTimer&&clearTimeout(this.shortTimer);
			if(this.isrecord){ //tag标记为true，代表用户迅速点击按钮后松开
				this.isrecord = false; //重置tag标记
				this.$wx.stopRecord(); //关闭录音
				this.voice.localId = "";
				return;
			}

			this.voice.recordTime = this.checkTime(this.voice.start,moment(),300); //检测录音时间是否太短
			if(!this.voice.needUpload){//上传状态判断
				this.$wx.stopRecord();
				this.voice.localId = "";
				return;
			}
			if(!this.voice.recordTime){//checkTime返回值是否满足条件
				this.$wx.stopRecord();
				this.voice.localId = "";
				return;
			}
			this.$nextTick(()=>{
				this.$wx.stopRecord({
					success:function(res) {
						this.voice.localId = res.localId;
						this.uploadVoice();
					}.bind(this),
					fail(res) {
						this.shortShow = true;//失败了也提示下，不然我也不知道提示什么
					}
				});
			})
		},
		/**
		 * 检测时间差值
		 * @Author   陈龙
		 * @DateTime 2017-12-08
		 * @version  [version]
		 * @param    {moment}   start 开始的时间
		 * @param    {moment}   end   结束的时间
		 * @param    {Number}   delay 差值（毫秒）
		 * @return   {Boolean}        true在delay内，false超出delay
		 */
		checkTime(start,end,delay){
			let _check = true;
			let  difference = end.valueOf() - start.valueOf();
			return difference > delay;
		},
		getPosition(e) {
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
		countDown(){
			if(this.countTimer) clearTimeout(this.countTimer);
			if(this.countStop) return;
			let _start = this.voice.start.valueOf();
			let _end = moment().valueOf();
			let _seconds = parseInt((_end - _start) / (1000) % 60,10);
			let _minutes = parseInt((_end - _start) / (1000 * 60) % 60,10);
			this.timetamp = parseInt((_end - _start) / 1000,10);
			this.time = `${_minutes < 10 ? "0"+_minutes:_minutes}:${_seconds < 10 ? "0"+_seconds:_seconds}`;
			if(_minutes >= 1){
				this.countStop = true;
			}
			this.countTimer = setTimeout(()=>{
				this.countDown();
			}, 1000);
		},
		uploadVoice(){
			this.$wx.uploadVoice({
				localId: this.voice.localId,
				success:function(res) {
					const weixinServer = new WeiXin();
					let serverId = res.serverId;
					weixinServer.sendMessage(this.timetamp,serverId).then(r=>{
						this.$parent.$emit('sendback', Date.now());
					})
				}.bind(this)
			});
		},
		forceStopRecord(){
			this.show = this.touching = false;
			channel.$emit('channel-voice',{
				state: true,
				name: 'open'
			});
			this.voice.text = '按住说话';
			this.countStop = true;
			this.$wx.stopRecord({
				success:function(res) {
					this.voice.localId = res.localId;
					this.uploadVoice();
				}.bind(this),
				fail(res) {
					askDialogToast({msg:JSON.stringify(res),class:"danger",time:2000});
				}
			});
		}
	}
}

</script>
