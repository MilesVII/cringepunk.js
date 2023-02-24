//import app from "./main";
//var PLATFORM = "unity";

export function init(){
	return new Promise(resolve => {
		if (mraid.getState() === "loading") {
			mraid.addEventListener("ready", onSdkReady); 
		} else {
			onSdkReady(); 
		}

		function onSdkReady() {
			waitUntilViewable().then(resolve);
		}
	});
}

export function waitUntilViewable(){
	return new Promise(resolve => {
		if (mraid.isViewable()) {
			resolve();
		} else {
			mraid.addEventListener("viewableChange", viewable => {
				if (viewable) {
					resolve();
				}
			});
		}
	});
}

export function openStoreLink(linkie){
	mraid.open(linkie);
}

export function sendCompleteMessage(){}