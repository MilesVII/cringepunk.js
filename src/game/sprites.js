import { Loader, Container, Sprite } from "pixi.js";

let textureMap = null;
export function setTextureMap(textures){
	textureMap = textures;
}

export function alignPivotKeepPosition(s, x = .5, y = .5){
	alignPivot(s, x, y);
	s.position.x += s.pivot.x;
	s.position.y += s.pivot.y;
}

export function alignPivot(s, x = .5, y = .5){
	let size = s.getLocalBounds();
	s.pivot.set(size.width * x, size.height * y);
}

export function getTexture(id){
	if (textureMap.has(id)){
		return textureMap.get(id);
	} else {
		return Loader.shared.resources[id].texture;
	}
}

export function createSprite(id, pivotX = 0, pivotY = 0){
	let s = new Sprite(getTexture(id));
	s.pivot.x = s.texture.width * pivotX;
	s.pivot.y = s.texture.height * pivotY;
	return s;
}

export function wrapAnimable(src){
	//Container to separate scaling by resize and by animations
	let container = new Container();
	container.addChild(src);
	src.on("destroyed", () => container.destroy());

	return {
		resizable: container,
		animable: src
	}
}

export function createRect(color, alpha, w, h, r){
	let rect = new PIXI.Graphics();
	rect.beginFill(color, alpha);
	if (r) 
		rect.drawRoundedRect(0, 0, w, h, r);
	else
		rect.drawRect(0, 0, w, h);
	rect.endFill();

	return rect;
}

export function createSquare(color, alpha, side){
	return createRect(color, alpha, side, side);
}

export function createCircle(color, alpha, radius = 420){
	let r = new PIXI.Graphics();
	r.beginFill(color, alpha);
	r.drawCircle(radius, radius, radius);
	r.endFill();

	return r;
}

export function createText(text, style){
	style ||= new PIXI.TextStyle({
		align: "center",
		fontFamily: "fomnt",
		fontSize: 90,
		fill: "white",
		stroke: "#000000",
		strokeThickness: 7,
		dropShadow: true,
		dropShadowColor: "#DDDDDD"
	});
	return new PIXI.Text(text, style);
}

export function fitToBox(s, w = null, h = null){
	const lb = s.getLocalBounds();
	if (!(w || h)){
		console.warning("Called fitToBox with no constraints");
		return;
	}
	w ||= Infinity;
	h ||= Infinity;
	s.scale.set(Math.min(
		w / lb.width,
		h / lb.height
	));
}