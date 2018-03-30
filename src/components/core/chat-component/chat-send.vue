<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.chat-send{
	width: 100%;
	background-color: map-get($color, 200D);
	box-shadow: 0 -2px 12px map-get($color, 400D2);
	@include flexLayout(flex,center,center);
	.cs-info{
		width: calc(100% - 20px);
		height: 34px;
		background-color: map-get($color,200);
		@include flexLayout(flex,justify,center);
		.ask-button{
			min-width: auto;
			padding: 0;
			.iconfont{
				font:inherit;
				color:inherit;
			}
		}
		.cs-type{
			width: 42px;
			height: 34px;
			overflow: hidden;
		}
		.cs-body{
			width: calc(100% - 42px - 42px);
			height: 34px;
			overflow: hidden;
		}
		.cs-choose{
			width: 42px;
			height: 34px;
			overflow: hidden;
			.ask-button{
				.add{
					vertical-align: bottom;
					display: inline-block;
					width: 22px;
					height: 22px;
					text-align: center;
					border-radius: 100%;
					border: 1px solid map-get($color,400S2);
					font-size: 1.6rem;
					position: relative;
					&::before{
						content: '';
						display: inline-block;
						position: absolute;
						top: 50%;
						left: 50%;
						background-color: map-get($color,400S2);
						width: 14px;
						height: 2px;
						margin: -1px 0 0 -7px;
					}
					&::after{
						content: '';
						display: inline-block;
						position: absolute;
						top: 50%;
						left: 50%;
						background-color: map-get($color,400S2);
						width: 2px;
						height: 14px;
						margin: -7px 0 0 -1px;
					}
				}
			}
		}
		.cs-type,
		.cs-choose{
			.ask-button{
				width: 42px;
				height: 34px;
				text-align: center;
				font-size: 2rem;
				color: map-get($color,400S2);
				input[type^="file"]{
					opacity: 0;
					display: none;
				}
			}
		}
		.cs-body{
			.cs-voice{
				width: 100%;
				height: 100%;
				.ask-button{
					width: 100%;
					height: 100%;
					/* border: 1px solid map-get($color,200S1); */
					text-align: center;
					border-radius: 0;
				}
			}
			.cs-input{
				width: 100%;
				height: 100%;
				@include flexLayout(flex,center,center);
				input{
					width: calc(100% - 42px);
					padding: 0 0 0 4px;
					color: map-get($color, 400D3);
					font-size: 1.4rem;
					border: none;
					outline: none;
					background-color: transparent;
					height: 100%;
					&~.ask-button{
						width: 42px;
						height: 34px;
						font-size: 1.6rem;
						color: map-get($color,400S2);
					}
				}
			}
		}
	}
}
</style>
<template>
	<div class="chat-send">
		<div class="cs-info">
			<div class="cs-type">
				<ask-button :hover="false" v-if="isVoice" @click.native="changVoice(false)"  :disabled="prohibitionSpeech" >
					<i class="iconfont icon-jianpan"></i>
				</ask-button>
				<ask-button :hover="false" v-else @click.native="changVoice(true)"  :disabled="prohibitionSpeech" >
					<i class="iconfont icon-yuyin"></i>
				</ask-button>
			</div>
			<div class="cs-body">
				<div class="cs-voice"  v-if="isVoice">
					<chat-send-voice></chat-send-voice>
				</div>
				<div class="cs-input" v-else>
					<input v-model="model.message" :disabled="prohibitionSpeech" :placeholder="prohibitionSpeech?'您不是讲师，无发言权限':'输入对话内容'" v-validate="'required'" name="message" ref="input">
					<ask-button :hover="false" :type="'submit'" :disabled="prohibitionSpeech || errors.has('message') || sendIng" @ask-click="sendMessage">
						<span class="button-text">
							<!-- <i class="iconfont icon-send"></i> -->
							发送
						</span>
					</ask-button>
				</div>
			</div>
			<div class="cs-choose">
				<ask-button :hover="false" class="add" :disabled="prohibitionSpeech">
					<label for="picture_input">
						<!-- <i class="iconfont icon-tianjia"></i> -->
						<span class="add"></span>
					</label>
					<!-- capture="camera" multiple="multiple" -->
					<input name="uploadfile" id="picture_input" @change="onChange($event)" type="file" accept="image/*">
				</ask-button>
			</div>
		</div>
	</div>
</template>
<script>
import EXIF from "exif-js";
import { Chat } from '@/services';
import chatSendVoice from './chat-send-voice.vue';
import { askDialogToast } from '@/utils';
export default {
	name: "chat-send",
	components:{
		'chat-send-voice':chatSendVoice
	},
	computed:{
		isPc:function(){
			let userAgentInfo = navigator.userAgent;
			let agents = ["Android", "iPhone","SymbianOS","Windows Phone","iPad", "iPod"];
			let flag = true;
			let result = agents.filter(a=> userAgentInfo.indexOf(a) > 0);
			if(result.length > 0) flag = false;
			return flag;
		}
	},
	data() {
		return {
			isVoice:false,
			sendIng: false,
			prohibitionSpeech:false,
			model: {
				message: ''
			}
		}
	},
	mounted() {
		const chatServer = new Chat();
		chatServer.info().then(r=>{
			if(r.data.ok) {
				this.prohibitionSpeech = r.data.is_allowed == 1 ? false : true;
			}
		})
		// this.$refs.input.focus();
	},
	methods: {
		changVoice(set){
			if(this.isPc){
				askDialogToast({msg:"语音功能只在移动端支持！",class:"danger",time:2000});
				return;
			}
			this.isVoice = set;
		},
		onChange(e) {
			const chatServer = new Chat();
			let self = this;
			Array.prototype.slice.call(e.target.files).map(index => {
				let formData = new FormData();
				formData.append("name", "uploadfile");
				formData.append("type", "image");
				formData.append("makethumb", 1);
				formData.append("thumbparam", '{"maxWidth":120,"maxHeight":120,"scale":true,"inflate":true}');
				// formData.append("uploadfile", index);
				let orientation;
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
						// document.body.appendChild(canvas);
						let base64 = canvas.toDataURL('image/jpeg');
						formData.append("uploadfile", self.base64UrlToBlob(base64));
						URL.revokeObjectURL(fileURL);
						chatServer.updateFile(formData).then(r => {
							if(!r.data.ok) return;
							let content = {
								type: 3,
								picurl: r.data.url,
								thumburl: r.data.thumburl
							}
							
							chatServer.sendMessage(JSON.stringify(content)).then(r => {
								self.$emit('sendback', r.data);
							})
						})
					}
					// }
				})
			});
			// Array.prototype.slice.call(e.target.files).map(index=>{
			// 	let formData = new FormData();
			// 	formData.append("name", "uploadfile");
			// 	formData.append("type", "image");
			// 	formData.append("makethumb", 1);
			// 	formData.append("thumbparam", '{"maxWidth":120,"maxHeight":120,"scale":true,"inflate":true}');
			// 	formData.append("uploadfile", index);
			// 	chatServer.updateFile(formData).then(r => {
			// 		if(!r.data.ok) return;
			// 		let content = {
			// 			type: 3,
			// 			picurl: r.data.url,
			// 			thumburl: r.data.thumburl
			// 		}
					
			// 		chatServer.sendMessage(JSON.stringify(content)).then(r => {
			// 			this.$emit('sendback', r.data);
			// 		})
			// 	})
			// });
		},
		sendMessage() {
			this.sendIng = true;
			this.$validator.validateAll().then((result) => {
				if (result) {
					const chatServer = new Chat();
					let msg = {
						type: 1,
						content: this.model.message
					}
					chatServer.sendMessage(JSON.stringify(msg)).then(r => {
						this.sendIng = false;
						this.model.message = '';
						this.$emit('sendback', r.data);
					},error=>{
						this.sendIng = false;
					})
					return;
				}
				
				this.sendIng = false;
			});
		},
		base64UrlToBlob(urlData){
		    let bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
		     
		    //处理异常,将ascii码小于0的转换为大于0
		    let ab = new ArrayBuffer(bytes.length);
		    let ia = new Uint8Array(ab);
		    for (let i = 0; i < bytes.length; i++) {
		        ia[i] = bytes.charCodeAt(i);
		    }
		 
		    return new Blob( [ia] , {type : 'image/png'});
		}
	}
}

</script>
