<style lang="scss">
@import '~@/styles/variables', '~@/styles/mixins';
.ask-reciprocal {
	width: 100%;
	.reciprocal-title {
		text-align: center;
		font-size: 1.2rem;
		color: map-get($color, 200);
	}
	.reciprocal-text {
		text-align: center;
		white-space: nowrap;
		color: map-get($color, 200);
		font-size: 1.6rem;
		&>em {
			color: map-get($color, 300);
			font-style: normal;
		}
	}
}

</style>
<template>
	<div class="ask-reciprocal">
		<slot></slot>
		<div class="reciprocal-text">
			<template v-for="(i,$i) in seckill">
				<template v-if="($i+1)%3 == 0">
					{{i}}
				</template>
				<template v-else>
					<em>{{i}}</em>
				</template>
			</template>
		</div>
	</div>
</template>
<script>
import moment from 'moment/moment.js';
let RECIPROCAL_TIMER = null;
export default {
	name: "reciprocal",
	props: ['server', 'time'],
	data() {
		return {
			seckill:[0,0,"秒"],
			text: '<em>00</em>天<em>00</em>时<em>00</em>分<em>00</em>秒',
			difference: 0
		}
	},
	mounted() {
		this.difference = this.server - moment().unix();
		this.reciprocalText(this.time);
	},
	watch: {
		time(n, o) {
			this.difference = this.server - moment().unix();
			this.reciprocalText(this.time);
		}
	},
	methods: {
		reciprocalText(time) {
			let difference = this.timeDiffer(time);
			let cur = this.timeConvert(difference);

			let _seckill = [];
			if(cur.d > 0){
				let day = this.numberConvert(cur.d);
				_seckill.push(day[0]);
				_seckill.push(day[1]);
				_seckill.push('天');
			}
			if(cur.h > 0){
				let hour = this.numberConvert(cur.h);
				_seckill.push(hour[0]);
				_seckill.push(hour[1]);
				_seckill.push('时');
			}
			if(cur.m > 0){
				let minute = this.numberConvert(cur.m);
				_seckill.push(minute[0]);
				_seckill.push(minute[1]);
				_seckill.push('分');
			}
			if(cur.s > 0){
				let second = this.numberConvert(cur.s);
				_seckill.push(second[0]);
				_seckill.push(second[1]);
				_seckill.push('秒');
			}

			this.seckill = _seckill;

			if (RECIPROCAL_TIMER) clearTimeout(RECIPROCAL_TIMER);

			if (parseInt(difference / 1000, 10) <= 0) return;

			RECIPROCAL_TIMER = setTimeout(() => {
				this.reciprocalText(time);
			}, 1000);

		},
		timeConvert(difference){
			let curDay = parseInt(difference / (1000 * 60 * 60 * 24), 10),
				curHours = parseInt(difference / (1000 * 60 * 60) % 24, 10),
				curMinutes = parseInt(difference / (1000 * 60) % 60, 10),
				curSeconds = parseInt(difference / (1000) % 60, 10);
			return {
				d: curDay,
				h: curHours,
				m: curMinutes,
				s: curSeconds
			}

		},
		numberConvert(num){
			let _a = [0,0];
			if(num < 10){
				if(num < 0){
					_a[0] = 0;
					_a[1] = 0;
				}else{
					_a[0] = 0;
					_a[1] = Math.abs(num);
				}
			}else{
				let _s = num + '';
				_a[0] = _s.substr(0,1);
				_a[1] = _s.substr(1,1);
			}
			return _a;
		},
		//根据传递过来的time计算与当前时间的差值，毫秒
		timeDiffer(time) {
			let _time = time * 1000, //传过来的时间戳是从秒获取的，转换成毫秒
				curTime = Date.now() + this.difference * 1000;

			let delay = 3000;
			curTime -= delay;

			let difference = _time - curTime;
			return difference;
		}
	}
}

</script>
