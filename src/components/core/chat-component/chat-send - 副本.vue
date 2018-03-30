<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.chat-send {
	width: 100%;
	background-color: map-get($color, 200D);
	box-shadow: 0 -2px 12px map-get($color, 400D2);
	@include flexLayout(flex, justify, center);
	form.content {
		width: calc(100% - 40px);
		margin: 0;
		@include flexLayout(flex, normal, center);
		padding: 10px 0 10px 10px;
	}
	.send-box {
		width: 50%;
		flex: 1 0 auto;
		background-color: map-get($color, 200);
		border-radius: 2px 0 0 2px;
		overflow: hidden;
		input {
			width: 100%;
			padding: 8px 0 8px 16px;
			color: map-get($color, 400D3);
			font-size: 1.4rem;
			border: none;
			outline: none;
			background-color: transparent;
			height: 34px;
		}
		textarea {
			width: 100%;
			padding: 8px 0 8px 16px;
			color: map-get($color, 400D3);
			font-size: 1.4rem;
			border: none;
			outline: none;
			background-color: transparent;
			min-height: 34px;
			max-height: 120px;
			resize: none;
		}
	}
	.send-btn {
		background-color: map-get($color, 200);
		.ask-button {
			min-width: auto;
			width: 100%;
			padding: 8px 12px;
			height: 34px;
			&.add {
				padding: 8px 10px;
			}
			.iconfont {
				color: map-get($color, 400S2);
				font-size: 1.6rem;
			}
			.picture-box {
				label {
					.iconfont {
						color: map-get($color, 400S2);
						font-size: 1.6rem;
					}
				}
				input {
					display: none;
					visibility: hidden;
					opacity: 0;
				}
			}
		}
	}
}

.hairline-top{
	&::before{
		content: '';
		position: absolute;
		background-color: #ddd;
		display: block;
		left: 0;
		top: 0;
		bottom: auto;
		right: auto;
		height: 1px;
		width: 100%;
		transform-origin: 0% 0%;
		-webkit-transform-origin: 0% 0%;
		transform: scaleY(0.5);
		-webkit-transform: scaleY(0.5);
	}
}

.hairline-bottom{
	&::after{
		content: '';
	    position: absolute;
	    background-color: #ddd;
	    display: block;
	    left: 0;
	    top: auto;
	    bottom: 0;
	    right: auto;
	    height: 1px;
	    width: 100%;
	    transform-origin: 0% 100%;
	    -webkit-transform-origin: 0% 100%;
	    transform: scaleY(0.5);
	    -webkit-transform: scaleY(0.5);
	}
}
</style>
<template>
	<div class="chat-send">
		<div class="change-type">
			<ask-button v-if="isVoice" @click.native="isVoice = false;"><i class="iconfont icon-jianpan"></i></ask-button>
			<ask-button v-else @click.native="isVoice = true;"><i class="iconfont icon-yuyin"></i></ask-button>
		</div>
		<div class="voice-box" v-if="isVoice">
			<ask-button class="voice-btn">按住说话</ask-button>
		</div>
		<form v-else="isVoice" @submit.prevent="sendMessage" class="content">
			<div class="send-box">
				<div class="hairline-top"></div>
				<input v-model="model.message" placeholder="输入对话内容" v-validate="'required'" name="message" ref="input">
				<div class="hairline-bottom"></div>
			</div>
			<div class="send-btn">
				<ask-button :hover="false" :type="'submit'" :disabled="errors.has('message')">
					<span class="button-text">
						<i class="iconfont icon-send"></i>
					</span>
				</ask-button>
			</div>
		</form>
		<div class="send-btn">
			<ask-button :hover="false" class="add">
				<div class="picture-box">
					<label for="picture_input">
						<i class="iconfont icon-add"></i>
					</label>
					<input name="uploadfile" id="picture_input" @change="onChange($event)" type="file" accept="image/*;capture=camera" multiple="multiple">
				</div>
			</ask-button>
		</div>
	</div>
</template>
<script>
import { Chat } from '@/services';
export default {
	name: "chat-send",
	data() {
		return {
			isVoice:false,
			model: {
				message: ''
			}
		}
	},
	mounted() {
		// this.$refs.input.focus();
	},
	methods: {
		onChange(e) {
			const chatServer = new Chat();
			Array.prototype.slice.call(e.target.files).map(index=>{
				let formData = new FormData();
				formData.append("name", "uploadfile");
				formData.append("type", "image");
				formData.append("makethumb", 1);
				formData.append("thumbparam", '{"maxWidth":120,"maxHeight":120,"scale":true,"inflate":true}');
				formData.append("uploadfile", index);

				chatServer.updateFile(formData).then(r => {
					if(!r.data.ok) return;
					let content = {
						type: 3,
						picurl: r.data.url,
						thumburl: r.data.thumburl
					}
					
					chatServer.sendMessage(JSON.stringify(content)).then(r => {
						this.$emit('sendback', r.data);
					})
				})
			});
		},
		sendMessage() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					const chatServer = new Chat();
					let msg = {
						type: 1,
						content: this.model.message
					}
					chatServer.sendMessage(JSON.stringify(msg)).then(r => {
						this.model.message = '';
						this.$emit('sendback', r.data);
					})
					return;
				}
			});
		}
	}
}

</script>
