// Each api must provide:
// async init()
// openStoreLink(link)
// sendCompleteMessage()
import * as mraidie from "./mraid.js";
import * as dapie from "./dapi.js";

const FB_ON = false;
const DEBUG_APIE = {
	init: () => true,
	openStoreLink: () => alert("Requested to open store link"),
	sendCompleteMessage: () => console.log("Tried sending complete message")
};

let currentApie = DEBUG_APIE;
const apol = "https://apps.apple.com/app/id1459968519";
const googol = "https://play.google.com/store/apps/details?id=com.red.business";

function getStoreLink(){
	const e = navigator.userAgent || navigator.vendor;
	if (/android/i.test(e))
		return googol;
	else
		return apol;
}

function mraid_available(){
	return (!!window.mraid) || false;
}

export async function init(audioChangeCB = ()=>{}, isDebug = false){
	if (isDebug) return;
	if (FB_ON) return;
	if (mraid_available()){
		currentApie = mraidie;
	} else {
		currentApie = dapie;
	}

	if (currentApie) await currentApie.init(audioChangeCB);
}

export function openStoreLink(){
	if (FB_ON) {
		FbPlayableAd.onCTAClick();
		return;
	}
	try {
		parent.postMessage("download", "*");
		if (currentApie) currentApie.openStoreLink(getStoreLink());
	} catch (e) {
		console.log("Tried opening store link");
	}
}

export function sendCompleteMessage(){
	if (FB_ON) return;
	try {
		parent.postMessage("complete", "*");
		if (currentApie) currentApie.sendCompleteMessage();
	} catch (e) {
		console.log("Tried sending complete message");
	}
}