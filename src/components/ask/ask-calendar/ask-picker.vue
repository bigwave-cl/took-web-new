<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.ask-picker {
	width: auto;
	display: inline-block;
	.calendar-label {
		width: auto;
		min-width: 50px;
		&>input {
			width: 100%;
			margin: 0;
			padding: 8px 10px;
			border: 1px solid map-get($calendar, 600);
			border-radius: 4px;
			outline: none;
			font-size: 1.6rem;
			color: map-get($calendar, 400);
		}
	}
}

</style>
<template>
	<div class="ask-picker">
		<div class="calendar-label" @click="showCalendar()">
			<input type="text" placeholder="选择时间" v-model="defaultTime">
		</div>
	</div>
</template>
<script>
import moment from 'moment/moment.js';
import { askCalnedar } from './ask-calendar.js';
export default {
	name: "ask-picker",
	props: {
		value: {
			type: String,
			default: () => moment().format("YYYY-MM-DD HH:mm:ss")
		}
	},
	data() {
		return {
			defaultTime: this.value
		}
	},
	mounted() {},
	methods: {
		showCalendar() {
			askCalnedar({ defaultTime: this.defaultTime }, (vm, time) => {
				this.defaultTime = time.moment.format("YYYY-MM-DD HH:mm:ss");
				this.$emit('picker', time.moment.format("YYYY-MM-DD HH:mm:ss"));
			});
		}
	}
}

</script>
