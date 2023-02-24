import * as Anime from "./anime.js"
import * as Utils from "./utils.js"

export const CAMERA_TYPES = {
	HORIZONTAL: "h",
	VERTICAL: "v"
}

export function createCamera(type, initial, worldContainer){
	return {
		type,
		position: initial,
		container: worldContainer
	};
}

export function createCamerime(camera, targetPosition, screenSize, options){
	let from = camera.position;
	Anime.createAnime(camera, (progress, camerime) => {
		camerime.sprite.position = Utils.lerp(Utils.easings.inOutCubic(progress), from, targetPosition);
		updateCamera(camera, screenSize);
	}, options);
}

export function updateCamera(camera, screenSize){
	if (camera.type == CAMERA_TYPES.HORIZONTAL){
		let np = Utils.lerp(camera.position, 0, screenSize.w - camera.container.width);
		camera.container.position.x = np;
	} else {
		let np = Utils.lerp(camera.position, 0, screenSize.h - camera.container.height);
		camera.container.position.y = np;
	}
}

export function worldToCameraPosition(camera, p, screenSize){
	if (camera.type == CAMERA_TYPES.HORIZONTAL){
		let projected = p.x * camera.container.scale.x;
		let position = projected - screenSize.w * .5;
		let relative = position / (camera.container.width - screenSize.w);
		return Utils.clamp(relative, 0, 1);
	} else {
		let projected = p.y * camera.container.scale.y;
		let position = projected - screenSize.h * .5;
		let relative = position / (camera.container.height - screenSize.h);
		return Utils.clamp(relative, 0, 1);
	}
}