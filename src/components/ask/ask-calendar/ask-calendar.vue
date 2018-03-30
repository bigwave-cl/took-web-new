<template>
	<ask-modal  :show="show" 
				:closeBtn="closeBtn"
				:closeIcon = "true"
				:shade="shade"
				:shadeColor="shadeColor"
				:shadeClick="shadeClick"
				@onclose="iconClose"
				class="calendar">
		<div class="ask-calendar-box">
			<div class="ac-monthly">
				<ask-button class="arrow-left" @ask-click="changeMonth('pre')"></ask-button>
				<div class="ac-caption">
					<ask-button class="btn-year" :text="curData.year" @ask-click="chooseYear()"></ask-button>
					<ask-button class="btn-month" :text="months[curData.month]" @ask-click="setShowInfo('month')"></ask-button>
				</div>
				<ask-button class="arrow-right" @ask-click="changeMonth('nex')"></ask-button>
			</div>
			<div class="ac-body">
				<div class="ac-picker" v-if="showInfo.day">
					<div class="ac-title">
						<ul>
							<li v-for="i in weeks">
								<span v-text="i"></span>
							</li>
						</ul>
					</div>
					<div class="ac-list">
						<template v-for=" i in dayListLength">
							<ul class="day-list" :key="i">
								<li v-for="(day,$d) in dayList" 
								    :class="{'unavailable': day.unavailable,'active': day.checked ,'not-use': rangeModel(day)}" 
								    :key="$d" 
								    @click="addState(day)" 
								    v-if="$d >= (7*i -7) && $d < 7*i">
									<span class="day">{{day.value}}</span>
								</li>
							</ul>
						</template>
					</div>
				</div>
				<transition name="ask-calendar-month">
					<div class="ac-picker" v-if="showInfo.month">
						<div class="ac-list">
							<template v-for=" i in 3">
								<ul class="month-list" :key="i">
									<li v-for="(m,$m) in months" :key="$m" v-if="$m >= (4*i - 4) && $m < 4*i">
										<ask-button @ask-click="setMonth($m)">
											<span class="button-text">{{m}}</span>
										</ask-button>
									</li>
								</ul>
							</template>
						</div>
					</div>
				</transition>
				<transition name="ask-calendar-year">
					<div class="ac-picker year" v-if="showInfo.year">
						<div class="ac-list" id="year_list">
							<ul class="year-list">
								<li v-for="(y,$y) in years" :key="$y">
									<ask-button @ask-click="setYear(y)">
										<span class="button-text">{{y}}</span>
									</ask-button>
								</li>
							</ul>
						</div>
					</div>
				</transition>
				<transition name="ask-calendar-time">
					<div class="ac-picker" v-if="showInfo.time">
						<div class="ac-list">
							<template v-if="timeChoose == 0">
								<ul class="time-list">
									<li v-for="(i,$i) in numbers" 
										v-if="$i < 24" 
										:class="{active: parseInt(curData.time.h,10) == $i}">
										<ask-button class="time" @ask-click="setTime('h',$i)">
											<span class="button-text">{{i}}</span>
										</ask-button>
									</li>
								</ul>
							</template>
							<template v-if="timeChoose == 1">
								<ul class="time-list more">
									<li v-for="(i,$i) in numbers" :class="{active: parseInt(curData.time.m,10) == $i}">
										<ask-button class="time" @ask-click="setTime('m',$i)">
											<span class="button-text">{{i}}</span>
										</ask-button>
									</li>
								</ul>
							</template>
							<template v-if="timeChoose == 2">
								<ul class="time-list more">
									<li v-for="(i,$i) in numbers" :class="{active: parseInt(curData.time.s,10) == $i}">
										<ask-button class="time" @ask-click="setTime('s',$i)">
											<span class="button-text">{{i}}</span>
										</ask-button>
									</li>
								</ul>
							</template>
						</div>
						<div class="ac-time">
							<ul>
								<li>
									<ask-button class="time" :class="{active: timeChoose == 0}" @ask-click="changeTime(0)">
										<span class="button-text">{{curData.time.h}}</span>
									</ask-button>
								</li>
								<li>
									<ask-button :class="'p'" :ripple="false" :hover="false">
										<span class="button-text">:</span>
									</ask-button>
								</li>
								<li>
									<ask-button class="time" :class="{active: timeChoose == 1}" @ask-click="changeTime(1)">
										<span class="button-text">{{curData.time.m}}</span>
									</ask-button>
								</li>
								<li>
									<ask-button :class="'p'" :ripple="false" :hover="false">
										<span class="button-text">:</span>
									</ask-button>
								</li>
								<li>
									<ask-button class="time" :class="{active: timeChoose == 2}" @ask-click="changeTime(2)">
										<span class="button-text">{{curData.time.s}}</span>
									</ask-button>
								</li>
							</ul>
						</div>
					</div>
				</transition>
			</div>
		</div>
		<ask-button slot="footer" class="time" :text="showInfo.time ? '返回日历':'选择时间'" @ask-click="showTimeBox"></ask-button>
		<ask-button slot="footer" class="ask-alert-btn" :text="btnText" @ask-click="sure"></ask-button>
	</ask-modal>
</template>
<style src="./ask-calendar.scss" lang="scss"></style>
<script>
import moment from 'moment/moment.js';
import { handlerSingleDigit } from '@/utils';
let ticking = false;
export default {
	name: 'ask-calendar',
	props: {
		shade: {
			type: Number,
			default: .4
		},
		shadeColor: {
			type: String,
			default: '#000'
		},
		shadeClick: {
			type: Boolean,
			default: true
		},
		show: {
			type: Boolean,
			default: false
		},
		icon: {
			type: Boolean,
			default: false
		},
		btnText: {
			type: String,
			default: '确定'
		},
		closeBtn: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			defaultTime: '',
			weeks: ['日', '一', '二', '三', '四', '五', '六'],
			months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			years: [],
			showInfo: {
				day: true,
				month: false,
				year: false,
				time: false,
			},
			timeChoose: 0, //0-h|1-m|2-s
			dayList: [],
			curData: {
				outTime: '',
				moment: '',
				year: '',
				month: '',
				day: '',
				time: {
					h: '00',
					m: '00',
					s: '00'
				}
			},
			format: 'YYYY-MM-DD HH:mm:ss',
			range:{
				model: false,
				state: 'start', //start|end
				start: '', 
				end: '', 
			}
		}
	},
	computed: {
		dayListLength() {
			return Math.ceil(this.dayList.length / 7);
		},
		numbers() {
			let _n = [];
			for (let i = 0; i < 60; i++) {
				let _v = i < 10 ? '0' + i : i;
				_n.push(_v);
			}
			return _n;
		}
	},
	mounted() {
		this.$nextTick(() => {
			if (this.show) {
				if (!this.defaultTime) {
					this.curData.outTime = moment();
				} else {
					this.curData.outTime = moment(this.defaultTime, this.format);
				}

				this.initDay(this.defaultTime);
			}
		})
	},
	methods: {
		sure() {
			this.$emit('onok');
			this.close();
		},
		close() {
			this.show = false;
			if (this.showInfo.year) this.removeScroll();
		},
		iconClose() {
			this.$emit('onclose');
		},
		rangeModel(day){
			let notUse = false;
			if(this.range.model){
				if(this.range.state == 'start' && this.range.end.diff(day.moment,'days') < 0){
					notUse = true;
				}
				if(this.range.state == 'end' && this.range.start.diff(day.moment,'days') >0){
					notUse = true;
				}
			}
			return notUse;
		},
		initDay(time) {
			if (!time) {
				this.curData.moment = moment();
			} else {
				this.curData.moment = moment(time, this.format);
			}
			this.setShowInfo('day');
			//设置选中的年月日
			this.setCurData();

			//本月和上月的天数
			let curMonthDay = this.curData.moment.daysInMonth();
			let preMonthDay = this.curData.moment.subtract(1, 'months').daysInMonth();
			this.curData.moment.add(1, 'months');
			//获得每月一号和最后一天是星期几 0->6 is 日->六
			let firstDayOnWeek = this.curData.moment.set('date', 1).day();
			let lastDayOnWeek = this.curData.moment.set('date', curMonthDay).day();
			this.curData.moment.set('date', this.curData.day);
			let days = [];

			for (let i = 1, l = curMonthDay; i <= l; i++) {
				let day = {
					value: i < 10 ? '0' + i : i,
					unavailable: false,
					checked: false,
					action: '',
					moment: moment(this.curData.moment).date(i)
				}
				if (i == this.curData.day &&
					moment(this.curData.outTime).get('month') == moment(this.curData.moment).get('month') &&
					moment(this.curData.outTime).get('year') == moment(this.curData.moment).get('year')
				) {
					day.checked = true;
				}
				days.push(day);
			}
			let preAdd = firstDayOnWeek == 0 ? 7 : firstDayOnWeek;
			for (let i = preMonthDay, l = preMonthDay - preAdd; i > l; i--) {
				let day = {
					value: i < 10 ? '0' + i : i,
					unavailable: true,
					checked: false,
					action: 'pre',
					moment: moment(this.curData.moment).subtract(1, 'months').date(i)
				}
				days.unshift(day);
			}
			let nexAdd = lastDayOnWeek == 6 ? 7 : 6 - lastDayOnWeek;

			for (let i = 1, l = nexAdd; i <= l; i++) {
				let day = {
					value: i < 10 ? '0' + i : i,
					unavailable: true,
					checked: false,
					action: 'nex',
					moment: moment(this.curData.moment).add(1, 'months').date(i)
				}
				days.push(day);
			}
			let surplus = 6 - Math.ceil(days.length / 7);
			for (let i = nexAdd + 1, l = nexAdd + 7 * surplus; i <= l; i++) {
				let day = {
					value: i < 10 ? '0' + i : i,
					unavailable: true,
					checked: false,
					action: 'nex',
					moment: moment(this.curData.moment).add(1, 'months').date(i)
				}
				days.push(day);
			}
			this.dayList = [];
			days.map((index, key) => {
				this.dayList.push(index);
			})
		},
		setCurData() {
			this.curData.year = this.curData.moment.get('year') + '';
			this.curData.month = this.curData.moment.get('month');
			this.curData.day = this.curData.moment.get('date');
			this.curData.time.h = handlerSingleDigit(this.curData.moment.get('hours'));
			this.curData.time.m = handlerSingleDigit(this.curData.moment.get('minutes'));
			this.curData.time.s = handlerSingleDigit(this.curData.moment.get('seconds'));
			// console.log(this.curData.year, this.curData.month + 1, this.curData.day, this.curData.time.h, this.curData.time.m, this.curData.time.s);
		},
		addState(day) {
			if(this.rangeModel(day)) return;
			
			if (day.unavailable) {
				this.changeMonth(day.action);
				return;
			};
			if (day.checked) return;
			let _index = this.dayList.indexOf(day);

			this.dayList = this.dayList.map((index, key) => {
				index.checked = false;
				if (_index == key) index.checked = true;
				return index;
			})
			this.curData.moment = day.moment;
			this.setCurData();
			this.$emit('onok');
		},
		changeMonth(type) {
			let time = '';
			if (type == "nex") {
				time = moment(this.curData.moment).add(1, 'months');
			}
			if (type == 'pre') {
				time = moment(this.curData.moment).subtract(1, 'months');
			}
			this.initDay(time);
		},
		setShowInfo(name) {
			Object.keys(this.showInfo).forEach((key) => {
				this.showInfo[key] = false;
				if (key == name) this.showInfo[key] = true;
			});
		},
		setMonth(index) {
			let time = moment(this.curData.moment).set('month', index);
			this.initDay(time);
		},
		setYear(year) {
			let time = moment(this.curData.moment).set('year', year);
			this.initDay(time);
		},
		setTime(type, value) {
			let time = '';
			if (type == 'h') time = this.curData.moment.set('hours', value);
			if (type == 'm') time = this.curData.moment.set('minutes', value);
			if (type == 's') time = this.curData.moment.set('seconds', value);
			this.setCurData();
			this.$emit('onok');
		},
		chooseYear() {
			let _year = parseInt(this.curData.year, 10);
			this.years = [];
			for (let i = _year - 100, l = _year + 10; i < l; i++) {
				this.years.push(i);
			}
			this.setShowInfo('year');

			this.$nextTick(() => {
				let listDom = this.$el.querySelector('#year_list');
				listDom.scrollTop = listDom.scrollHeight - 650;
				this.addScroll();
			})

		},
		addScroll() {
			let askEl = this.$el.querySelector('#year_list');
			askEl.addEventListener('scroll', this.scrollEvent);
		},
		removeScroll() {
			let askEl = this.$el.querySelector('#year_list');

			if (askEl) {
				askEl.removeEventListener('scroll', this.scrollEvent, false);
			}
		},
		scrollEvent() {
			let askEl = this.$el.querySelector('#year_list');
			let last_known_scroll_position = askEl.scrollTop;
			if (!ticking) {
				window.requestAnimationFrame(() => {
					if (last_known_scroll_position != 0 && askEl.scrollHeight - (askEl.clientHeight + last_known_scroll_position) <= 0) {
						this.years.push(this.years[this.years.length - 1] + 1);
					}
					if (last_known_scroll_position < 10) {
						this.years.unshift(this.years[0] - 1);
					}
					ticking = false;
				});
			}
			ticking = true;
		},
		showTimeBox() {
			if (!this.showInfo.time) {
				this.setShowInfo('time');
			} else {
				this.setShowInfo('day');
			}
		},
		changeTime(index) {
			this.timeChoose = index;
		}
	},
	watch: {
		'showInfo.year' (n, o) {
			if (!n) this.removeScroll();
		}
	}
}

</script>
