<template>
	<div id="app" class="container">
		<router-view></router-view>
		<ask-loader :show="show"></ask-loader>
		<sideslip :show="sideslipShow" :url="lotterySideUrl"></sideslip>
	</div>
</template>
<style src="./styles/base.scss" lang="scss"></style>
<style src="./styles/compatible.scss" lang="scss"></style>
<script>
/*import mojs from 'mo-js';
const burst = new mojs.Burst({
  left: 0, top: 0,
  radius:   { 4: 32 },
  angle:    45,
  count:    14,
  children: {
    radius:       2.5,
    fill:         '#FD7932',
    scale:        { 1: 0, easing: 'quad.in' },
    pathScale:    [ .8, null ],
    degreeShift:  [ 13, null ],
    duration:     [ 500, 700 ],
    easing:       'quint.out'
  }
});*/

/*document.addEventListener( 'click', function (e) {
  const coords = { x: e.pageX, y: e.pageY };
  burst
    .tune(coords)
    .replay();
});*/
import askOverlay from '@/components/ask/ask-overlay/ask.overlay.js';
import sideslip from '@core/sideslip/sideslip.vue';
export default {
	name: 'app',
	components: {
		sideslip
	},
	provide() {
		return {
			rootMain: this
		};
	},
	data() {
		return {
			show: false,
			index: 0,
			sideslipShow: false,
			lotterySideUrl: {
				detail: '',
				rule: '',
				record: ''
			}
		}
	},
	watch: {
		'$route' (to, from) {
			askOverlay.closeAll();
		}
	},
	methods: {
		/**
		 * 加载等待框
		 * @Author   陈龙
		 * @DateTime 2017-10-20
		 * @version  [version]
		 * @param    {[type]}   state Boolean: true|false true代表打开加载等待，false代表关闭加载等待
		 */
		loader(state) {
			if (state) {
				if (this.index == 0) this.show = true;
				this.index++;
			} else {
				this.index--;
				if (this.index == 0) this.show = false;
			}
		},
		setSideUrl(detail, rule, record) {
			this.lotterySideUrl.detail = detail;
			this.lotterySideUrl.rule = rule;
			this.lotterySideUrl.record = record;
		},
		sideslipToggle(state) {
			if (state && (state == 'open' || state == 'close')) {
				if (state == 'open') {
					this.sideslipShow = true;
				}
				if (state == 'close') {
					this.sideslipShow = false;
				}
				return;
			}
			this.sideslipShow = !this.sideslipShow;
		}
	}
}

</script>
