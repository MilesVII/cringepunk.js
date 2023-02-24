import * as game from "./game/game";
import * as Sounding from "./game/sounding.js"
import * as PIXI from "pixi.js";

import * as assets from "./assets.js"
import prepareTextures from "./loaders/clippingLoader.js"
import { addFonts } from "./loaders/fontLoader.js"
import * as ads from "./ads/ads_api.js";

main();

function loadAss_ets(images) {
	return new Promise (async (resolve) => {
		PIXI.Loader.shared.add(images).load(resolve)
	})
}

async function main(){
	const DEBUG_MODE = process.env.NODE_ENV == "development";
	await ads.init(volume => Sounding.setVolume(volume), DEBUG_MODE);

	PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;

	const app = new PIXI.Application({
		resizeTo: window, 
		backgroundColor: 0x000000,
		resolution: devicePixelRatio,
		antialias: true
	});

	const MASK = "_mask"
	let clippedAssets = Object.keys(assets.graphics)
		.filter(key => !key.endsWith(MASK) && assets.graphics[key + MASK])
		.map(key => {
			return {
				key: key,
				raw: assets.graphics[key],
				mask: assets.graphics[key + MASK]
			}
		});

	let pixiAssets = Object.keys(assets.graphics)
		.filter(key => !key.endsWith(MASK) && !clippedAssets.find(i => i.key == key))
		.map(key => {
			return {
				name: key,
				url: assets.graphics[key]
			}
		});

	let fonts = Object.keys(assets.fonts).map(name => {
		return {
			name,
			data: assets.fonts[name]
		};
	});

	let jesusOnline = await Promise.all([
		loadAss_ets(pixiAssets),
		prepareTextures(clippedAssets),
		addFonts(fonts)
	]);
	let wiresAcrossTheWorld = jesusOnline[1];

	window.addEventListener("resize", () => game.resize(window.innerWidth, window.innerHeight));

	document.body.appendChild(app.view);
	game.start(app, {
		textures: wiresAcrossTheWorld, 
		jsons: assets.jsons, 
		texts: assets.texts, 
		sounds: assets.sounds,
		debug: DEBUG_MODE
	});
}