//TODO: Make a proper module of it
//Currently unused due to inefficiency

const useCustomDecoder = false;
import * as baseCoder from "../wp_inliner/base256Coder.js"; // Must be the same as used by WP inliner
function decodeAssets(raw){
	function wrap(r){
		return URL.createObjectURL(new Blob([r.buffer]));
	}
	let started = Date.now();

	let decoded = {};
	Object.keys(raw).forEach(ass => {
		let appendix = raw[ass].appendix;
		let uncut = baseCoder.decode(raw[ass].data);
		let cut = appendix > 0 ? uncut.slice(0, -appendix) : uncut;
		let blob = wrap(cut);
		decoded[ass] = blob;
	});

	console.log("decoding overhead: " + (Date.now() - started) + "ms");
	return decoded;
}

const images = useCustomDecoder ? decodeAssets(imagesRaw) : imagesRaw;