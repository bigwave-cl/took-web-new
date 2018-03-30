<template>
	<transition :name="transition" @after-enter="afterEnter" @after-leave="afterLeave">
		<div class="ask-modal" v-if="show" :style="style" :class="theme">
			<div class="ask-visually-hidden"></div>
			<div class="ask-modal-header" v-if="title || !closeIcon">
				<div class="ask-modal-title" v-if="title">
					{{title}}
				</div>
				<div class="ask-close-icon" v-if="!closeIcon" @click.once="close"></div>
			</div>
			<div class="ask-modal-body">
				<slot>
					<div class="custom" v-html="content" @click.once="customClose">
					</div>
				</slot>
			</div>
			<div class="ask-modal-footer" v-if="!closeBtn">
				<slot name="footer">
					<ask-button text="关闭" @ask-click="cancel"></ask-button>
				</slot>
			</div>
			<div class="ask-visually-hidden"></div>
		</div>
	</transition>
</template>
<style src="./ask-modal.scss" lang="scss"></style>
<script>
import askOverlay from '../ask-overlay/ask.overlay.js';
export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: ''
		},
		closeBtn: {
			type: Boolean,
			default: false
		},
		closeIcon: {
			type: Boolean,
			default: false
		},
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
		content: {
			type: '',
			default: ''
		},
		contentClick: {
			type: Boolean,
			default: false
		},
		transition: {
			type: String,
			default: 'ask-modal-door'
		}
	},
	data() {
		return {
			zIndex: null,
			theme: ''
		}
	},
	computed: {
		style() {
			return {
				'z-index': this.zIndex === null ? 'auto' : this.zIndex
			}
		}
	},
	methods: {
		customClose() {
			if (this.contentClick) {
				this.$emit('onclose');
			}
		},
		cancel() {
			this.$emit('oncancel');
		},
		close() {
			this.$emit('onclose');
		},
		afterEnter() {
			this.$emit('initmodal');
		},
		afterLeave() {
			if (this.$el.remove) this.$el.remove();
			this.$destroy();
		}
	},
	mounted() {
		if (this.show) askOverlay.open(this);
	},
	destroyed() {
		this.$nextTick(function() {
			askOverlay.close(this, 'des');
		})
	},
	watch: {
		show: function(n, o) {
			if (n) {
				askOverlay.open(this);
			} else {
				// askOverlay.close(this,'one');
			}
		}
	}
}

</script>
