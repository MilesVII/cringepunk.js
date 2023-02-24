import * as PIXI from 'pixi.js';
import 'pixi-spine';

//import { RES_DUMP } from "./dump.js";
import { getTexture } from "./sprites.js";

let textureMap = null;
export function setSpineTextureMap(textures){
	textureMap = textures;
}

/* http://en.esotericsoftware.com/spine-api-reference#AnimationState-setAnimation */
export function createSpine(gfxId, json, atlas){
	//https://github.com/pixijs/spine/blob/master/examples/preloaded_json.md
	
	let rawAtlasData = atlas;
	let rawSkeletonData = json;
	
	let spineAtlas = new PIXI.spine.core.TextureAtlas(rawAtlasData, function(line, callback) {
		callback(getTexture(gfxId));
	});
	let spineAtlasLoader = new PIXI.spine.core.AtlasAttachmentLoader(spineAtlas)
	let spineJsonParser = new PIXI.spine.core.SkeletonJson(spineAtlasLoader);
	let spineData = spineJsonParser.readSkeletonData(rawSkeletonData);
	return new PIXI.spine.Spine(spineData);
}