//import app from "./main"

export function init(audioChangeCB){
	return new Promise(resolve => {
		setTimeout(resolve, 2000);
		window.onload = function(){
			(dapi.isReady()) ? onReadyCallback() : dapi.addEventListener("ready", onReadyCallback);
		};

		function onReadyCallback(){
			dapi.removeEventListener("ready", onReadyCallback);
			waitUntilViewable().then(presolve);
		}

		function presolve(){
			dapi.getScreenSize();
			audioChangeCB(dapi.getAudioVolume() / 100);
			dapi.addEventListener("audioVolumeChange", v => audioChangeCB(v / 100));
			resolve();
		}
	});
}

export function waitUntilViewable(){
	return new Promise(resolve => {
		if (dapi.isViewable()) {
			resolve();
		} else {
			dapi.addEventListener("viewableChange", event => {
				if (event.isViewable) {
					resolve();
				}
			});
		}
	});
}

export function openStoreLink(linkie){
	dapi.openStoreUrl(linkie);
}

export function sendCompleteMessage(){}