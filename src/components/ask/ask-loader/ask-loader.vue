<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
$bg: rgba(0, 0, 0, .3);
.ask-loader-box {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	width: 100vw;
	height: 100vh;
	z-index: 3000000;
	pointer-events: none;
	.ask-loader-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-color: $bg;
		pointer-events:auto;
	}
	.ask-lodaer-body {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		@include flexLayout(flex, center, center);
		transform: translate(0, -50%);
		z-index: 2;
		margin-top: -20px;
		&>div {
			font-size: 2rem;
			font-weight: 900;
			margin: 0 4px;
			transform: translateY(20px) scaleY(1) translateZ(0);
			&:nth-child(3n+1) {
				color: map-get($loader, 100);
				animation: ask-loader-bounce 1.2s cubic-bezier(0.30, 2.40, 0.85, 2.50) infinite;
			}
			&:nth-child(3n+2) {
				color: map-get($loader, 200);
				animation: ask-loader-bounce 1.2s .2s cubic-bezier(0.30, 2.40, 0.85, 2.50) infinite;
			}
			&:nth-child(3n+3) {
				color: map-get($loader, 500);
				animation: ask-loader-bounce 1.2s .6s cubic-bezier(0.30, 2.40, 0.85, 2.50) infinite;
			}
			&:nth-child(3n+4) {
				color: map-get($loader, 600);
				animation: ask-loader-bounce 1.2s .8s cubic-bezier(0.30, 2.40, 0.85, 2.50) infinite;
			}
		}
	}
}

@keyframes ask-loader-bounce {
	0%, 100% {
		transform: translateY(20px) scaleY(.8) translateZ(0);
	}
	80% {
		transform: translateY(5px) scaleY(1.02) translateZ(0);
	}
}

</style>
<template>
	<div class="ask-loader-box" v-if="show">
		<div class="ask-loader-overlay"></div>
		<div class="ask-lodaer-body">
			<div>A</div>
			<div>S</div>
			<div>K</div>
			<!-- <div>T</div>
			<div>O</div>
			<div>O</div>
			<div>K</div> -->
		</div>
	</div>
</template>
<script>
export default {
	name: "ask-loader",
	props: ["show"]
}

</script>
