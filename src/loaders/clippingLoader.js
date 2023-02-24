import * as PIXI from "pixi.js";

/*
	Loader for masked sprites
	Clips textures according to a mask
	Returns Map<PIXI.Texture> which can be used to create a sprite

	base64srcs: [{
		raw: "base64image", 
		mask: "base64image",
	}]
	// Any valid img-src can be used instead of base64, including blob urls
*/

async function prepareTextures(base64srcs) {
	let clippedTextures = new Map();

	let c = [
		document.createElement('canvas'),
		document.createElement('canvas')
	];
	let ctx = [
		c[0].getContext('2d'),
		c[1].getContext('2d')
	];
	async function loadImage(e, url) {
		return new Promise(resolve => {
			e.onload = () => resolve(e);
			e.src = url;
		});
	}

	for (let image of base64srcs){
		let i = new Image();
		let m = new Image();
		await Promise.all([
			loadImage(i, image.raw),
			loadImage(m, image.mask)
		]);
		c[0].width = c[1].width = i.width;
		c[0].height = c[1].height = i.height;

		ctx[0].drawImage(i, 0, 0);
		ctx[1].drawImage(m, 0, 0);

		let d0 = ctx[0].getImageData(0, 0, i.width, i.height);
		let d1 = ctx[1].getImageData(0, 0, i.width, i.height);

		let buffer = d0.data.map((v, i) => (i + 1) % 4 == 0 ? d1.data[i - 1] : v);
		let unclamped = new Uint8Array(buffer);
		let t = PIXI.Texture.fromBuffer(unclamped, d0.width, d0.height);
		clippedTextures.set(image.key, t);
	}

	return clippedTextures;
}

export default prepareTextures;