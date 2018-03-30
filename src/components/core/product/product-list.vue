<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.product-list {
	width: 100%;
	padding: 5px 0;
}

</style>
<template>
	<div class="product-list">
		<template v-for="(product,$i) in products">
			<product-item :product="product"></product-item>
		</template>
	</div>
</template>
<script>
import productItem from "./product-item.vue";
export default {
	name: "product-list",
	props: ['products'],
	components: {
		"product-item": productItem
	}
}
</script>
