<style lang="scss">
@import '~@/styles/mixins', '~@/styles/variables';
.ask-picker {
	width: auto;
	@include flexLayout(inline-flex, normal, center);
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
	.space {
		width: 14px;
		height: 1px;
		border: 1px solid map-get($calendar, 400);
		margin: 0 4px;
	}
}

</style>
<template>
	<div class="ask-picker">
		<div class="calendar-label" @click="showCalendar('start')">
			<input type="text" placeholder="开始时间" v-model="startTime">
		</div>
		<div class="space"></div>
		<div class="calendar-label" @click="showCalendar('end')">
			<input type="text" placeholder="结束时间" v-model="endTime">
		</div>
	</div>
</template>
<script>
import moment from 'moment/moment.js';
import { askCalnedar } from './ask-calendar.js';
export default {
	name: "ask-picker-range",
	props: {
		start: {
			type: String,
			default: () => moment().format("YYYY-MM-DD HH:mm:ss")
		},
		end: {
			type: String,
			default: () => moment().format("YYYY-MM-DD HH:mm:ss")
		}
	},
	data() {
		return {
			startTime: this.start,
			endTime: this.end,
			format: "YYYY-MM-DD HH:mm:ss"
		}
	},
	mounted() {
		// this.$nextTick(()=>{
		// 	this.startTime = moment("2017-10-10 10:10:10", this.format).format(this.format);
		// 	this.endTime = moment("2017-10-20 10:10:10", this.format).format(this.format);
		// })
	},
	methods: {
		showCalendar(type) {
			if (type == 'start') {
				askCalnedar({
					type: 'range',
					state: 'start',
					start: moment(this.startTime, this.format),
					end: moment(this.endTime, this.format)
				}, (vm, time) => {
					this.startTime = time.moment.format(this.format);
					this.$emit('picker', ['start', time.moment.format(this.format)]);
				});
			}
			if (type == 'end') {
				askCalnedar({
					type: 'range',
					state: 'end',
					start: moment(this.startTime, this.format),
					end: moment(this.endTime, this.format)
				}, (vm, time) => {
					this.endTime = time.moment.format(this.format);
					this.$emit('picker', ['end', time.moment.format(this.format)]);
				});
			}
		}
	}
}

</script>
