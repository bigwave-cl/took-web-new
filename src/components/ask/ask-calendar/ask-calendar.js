/*
 * @Author: askMeWhy
 * @Date:   2017-10-12 10:19:08
 * @Last Modified by:   smile
 * @Last Modified time: 2017-11-03 16:46:03
 */
import Vue from 'vue'
import ComponentTemplate from './ask-calendar.vue';
const VueComponent = Vue.extend(ComponentTemplate);

export const askCalnedar = (options, onOk, onClose) => {
	let vm = new VueComponent().$mount();
	if (options.type && options.type == 'range') {
		vm.range.model = true;
		vm.range.state = options.state;
		vm.range.start = options.start;
		vm.range.end = options.end;
		vm.defaultTime = options[options.state];
	} else if (options.defaultTime) vm.defaultTime = options.defaultTime;

	vm.$on('onok', () => {
		if (onOk) onOk(vm, vm.curData);
	});
	vm.$on('onclose', () => {
		vm.show = false;
		if (onClose) onClose(vm, vm.curData);
	});
	document.body.appendChild(vm.$el);
	vm.show = true;
}
