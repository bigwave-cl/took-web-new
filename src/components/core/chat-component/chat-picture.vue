<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.ask-button.chat-picture {
	width: auto;
	min-width: auto;
	padding: 0;
	img {
		max-width: 100%;
	}
}
</style>
<template>
	<ask-button :hover="false" class="chat-picture" @ask-click="viewPicture">
		<img :src="thumb || '/null.png'" @load="onLoad" @error="onError" alt="图片">
	</ask-button>
</template>
<script>
export default {
	name: "chat-picture",
	inject: ['chatMain'],
	props: ["id", 'thumb', 'picture'],
	methods: {
		viewPicture() {
			const index = this.chatMain.loadImg.findIndex(p => p.id == this.id);
			this.chatMain.previewer.show(index);
		},
		onLoad() {
			this.$emit('loadBack');
		},
		onError(){
			this.$emit('loadBack');
		}
	}
}
</script>
