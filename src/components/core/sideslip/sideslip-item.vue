<template>
	<ask-button @ask-click="onTap">
		<div class="sideslip-item">
			<div class="info">
				<slot></slot>
			</div>
			<div class="icon">
				<i class="iconfont" :class="'icon-'+icon"></i>
			</div>
		</div>
	</ask-button>
</template>
<script>
export default {
	name: "sideslip-item",
	props: {
		icon: {
			type: String,
			default: "arrow-right"
		}
	},
	methods: {
		onTap() {
			this.$emit('ontap');
		}
	}
}

</script>
