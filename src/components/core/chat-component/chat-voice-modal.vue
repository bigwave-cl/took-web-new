<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
	.chat-voice-modal.ask-modal-box{
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
		}
		.voice-record{
			width: 100%;
			height: 100%;
			@include flexLayout(flex, center, center);
			text-align: center;
		}
		.vr-cancel{
			display: inline-block;
			text-align: center;
			color: map-get($color,200);
			.vr-cicon{
				font-size: 7rem;
				font-weight: 900;
				.iconfont{
					display: inline-block;
					font:inherit;
					color: inherit;
					transform:rotate(-90deg);
				}
			}
		}
		.vr-text{
			padding-top: 18px;
			font-size: 1.6rem;
			white-space: nowrap;
		}
		.vr-no-cancel{
			text-align: center;
			color: map-get($color,200);
			font-size: 1.6rem;
			.vr-microphone{
				@include flexLayout(inline-flex,normal,bottom);
				.vr-micon{
					font-size: 7rem;
					line-height: .92;
					.iconfont{
						font: inherit;
						color: inherit;
					}
				}
				.vr-mani{
					margin-right: 14px;
					width: 40px;
					height: 60px;
					flex: 0 0 40px;
					overflow: hidden;
					position: relative;
					animation: voice-play 3s steps(5,start) infinite;
					.vr-rinfo{
						width: 40px;
						height: 60px;
						overflow: hidden;
						position: absolute;
						bottom: 0;
						&>div{
							height: 6px;
							background-color: map-get($color,200);
							margin-top: 6px;
							position: relative;
							&::after{
								content:"";
								display: block;
								width: 0;
								height: 0;
								border-top: 6px solid map-get($color,200);
								border-right: 2px solid transparent;
								position: absolute;
								top: 0;
								right: 0;
								margin-right: -2px;
							}
						}
						@for $i from 1 through 6 {
							&>div:nth-child(#{$i}){
								$weight: 34 - ( ($i - 1) * 3 );
								width: #{$weight+'px'};
							}
						}
					}
				}
			}
			.vr-text{
				padding: 18px 0 0;
			}
		}
	}
	@keyframes voice-play {
		to {
			height: 60px;
		}
		from {
			height: 0;
		}
	}
</style>
<template>
	<ask-modal :show.sync="modalShow"
				:showHeader="false"
				:showFooter="false"
				:shade="0"
				:transition="'chat-voice-modal-scale'"
				class="chat-voice-modal"
	>
		<div class="voice-record">
			<template v-if="cancelShow">
				<div class="vr-cancel">
					<div class="vr-cicon"><i class="iconfont icon-fanhui"></i></div>
					<div class="vr-text">松开手指，取消发送</div>
				</div>
			</template>
			<template v-else>
				<div class="vr-no-cancel">
					<div class="vr-microphone">
						<div class="vr-micon">
							<i class="iconfont icon-see-icon-m3-voice-fill"></i>
						</div>
						<div class="vr-mani">
							<div class="vr-rinfo">
								<div></div>
								<div></div>
								<div></div>
								<div></div>
								<div></div>
							</div>
						</div>
					</div>
					<div class="vr-text">手指上划，取消发送</div>
				</div>
			</template>
		</div>
	</ask-modal>
</template>
<script>
	export default{
		name:"ChatVoiceModal",
		props:{
			show:{
				type:Boolean,
				default:false
			},
			cancelShow:{
				type:Boolean,
				default:false //取消模块显示？true=>显示，false=>不显示
			},
			time:{
				type:String,
				default:"00:00"
			}
		},
		data(){
			return{
				modalShow:this.show
			}
		},
		watch:{
			show:function(n,o){
				this.modalShow = this.show;
			}
		}
	}
</script>