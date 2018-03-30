<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.product-item {
	width: 100%;
	padding: 5px 10px;
	.ask-button {
		min-width: auto;
		width: 100%;
		background-color: map-get($color, 200);
		border: 1px solid map-get($color, 200S1);
		border-radius: 4px;
		padding: 0;
		.box {
			width: 100%;
			padding: 8px;
			@include flexLayout(flex, normal, normal);
			.cover {
				width: 26%;
				.img-box {
					width: 100%;
					padding: 50% 0;
					position: relative;
					img {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						width: 100%;
						height: 100%;
					}
				}
			}
			.info {
				flex: 1 0 auto;
				width: 74%;
				position: relative;
				text-align: left;
				padding: 10px 0 10px 10px;
				.title {
					font-size: 1.6rem;
					color: map-get($color, 400D3);
					@include textEllipsis(2);
					line-height: 2rem;
				}
				.price {
					position: absolute;
					bottom: 0;
					left: 10px;
					right: 0;
					font-size: 1.8rem;
					color: map-get($color, 100);
				}
			}
		}
	}
}

.ask-modal.product-iframe {
	width: 100%;
	height: 100%;
	max-width: none;
	padding: 0;
	border-radius: 0;
	top: 0;
	left: 0;
	transform: none;
	.ask-modal-body {
		width: 100%;
		height: calc(100% - 54px);
		padding: 0;
		position: relative;
		.custom {
			width: 100%;
			height: 100%;
			iframe {
				width: 100% !important;
				height: 100% !important;
				-webkit-overflow-scrolling: touch;
				overflow: auto;
				max-width: 100%;
				border: 1px solid red;
			}
		}
	}
}

</style>
<template>
	<div class="product-item">
		<a :href="product.url" title="链接">
			<ask-button :hover="false">
				<div class="box">
					<div class="cover">
						<div class="img-box">
							<img :src="product.pic" alt="商品图片">
						</div>
					</div>
					<div class="info">
						<div class="title">{{product.name}}</div>
						<div class="price">{{product.price}}</div>
					</div>
				</div>
			</ask-button>
		</a>
	</div>
</template>
<script>
export default {
	name: "product-item",
	props: ['product']
}

</script>
