//按钮控件
import askButton from './ask-button/ask-button.vue';
import askRipple from './ask-ripple/ask-ripple.vue';

//模态框控件
import askModal from './ask-modal/ask-modal.vue';
import askOverlay from './ask-overlay/ask-overlay.vue';
import askLoader from './ask-loader/ask-loader.vue';


//swiper模块
import askSwiper from './ask-swiper/ask-swiper.vue';
import askSlide from './ask-swiper/ask-slide.vue';


//tab组件
import askTabComponents from './ask-tab';

//ask-scroll组件
import askScroll from './ask-scroll';

//radio组件
import askRadio from './ask-radio/ask-radio.vue';

//input组件
import askInput from './ask-input/ask-input.vue';

//select组件
import askSelect from './ask-select/ask-select.vue';
import askOption from './ask-select/ask-option.vue';

import askLotteryAnimation from './ask-lottery-animation/ask-lottery-animation.vue';
import askPreviewer from './ask-previewer/ask-previewer.vue';

const components = {
	'ask-button': askButton,
	'ask-modal': askModal,
	'ask-ripple': askRipple,
	'ask-swiper':askSwiper,
	'ask-slide':askSlide,
	'ask-overlay':askOverlay,
	'ask-loader':askLoader,
	'ask-radio':askRadio,
	'ask-input':askInput,
	'ask-select':askSelect,
	'ask-option':askOption,
	'ask-lottery-animation':askLotteryAnimation,
	'ask-previewer':askPreviewer,
}
Object.assign(components,askTabComponents,askScroll);

export default {
	install(Vue) {
		Object.keys(components).forEach((key) => Vue.component(key, components[key]));
	}
}
