/*
* @Author: askMeWhy
* @Date:   2017-10-31 11:27:58
* @Last Modified by:   smile
* @Last Modified time: 2017-11-02 17:14:46
*/
const appendOnDocument = (el) => {
	if (document.getElementsByTagName('body')[0]) {
		document.getElementsByTagName('body')[0].appendChild(el);
	} else {
		var wrap = document.createElement('div');
		wrap.appendChild(el);
		document.write(wrap.innerHTML);
	}
}
export const chatVoice = (bg) => {
	removeChatVoice();
	let audioEl = document.createElement('audio'),
		sourceEl = document.createElement('source');
	sourceEl.src = bg;
	sourceEl.type = "audio/mp3";
	audioEl.autoplay = true;
	audioEl.loop = false;
	audioEl.setAttribute("id", "ask_chat_audio");
	audioEl.appendChild(sourceEl);
	appendOnDocument(audioEl);

	return audioEl;
}
export const removeChatVoice = ()=>{
	let oldAudioEl = document.getElementById('ask_chat_audio');
	if (oldAudioEl && oldAudioEl.remove) oldAudioEl.remove();
}