export const TAU = Math.PI * 2;
export function lerp(k, from, to) {
	return from + (to - from) * k; 
}
export function remap(x, fromMin, fromMax, toMin, toMax) {
	return (x - fromMin) / (fromMax - fromMin) * (toMax - toMin) + toMin;
}
export function clamp(x, min, max) {
	return x > min ? (x < max ? x : max) : min;
}
export function distance2(ax, ay, bx, by) {
	return Math.pow(ax - bx, 2) + Math.pow(ay - by, 2);
}
export function distance(ax, ay, bx, by) {
	return Math.sqrt(distance2(ax, ay, bx, by));
}
export function direction(ax, ay, bx, by) {
	let x = Math.atan2(bx - ax, by - ay) + TAU * .75;
	while (x > TAU) x -= TAU;
	return x;
}
export function quadrant(angle, offset){
	let x = angle + offset;
	while (x > TAU) x -= TAU;
	if (x < TAU * .25) return 0;
	if (x < TAU * .50) return 1;
	if (x < TAU * .75) return 2;
	return 3;
}

function inOutCubic(x){
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
export const easings = {
	inOutCubic: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
	outBack: x => {
		const c1 = 1.70158;
		const c3 = c1 + 1;
		return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
	},
	parabola: x => {
		x = remap(Math.abs(x - .5), .5, 0, 0, 1);
		return inOutCubic(x);
	},
	getSinePart: (from, to) => {
		return x => Math.sin(lerp(x, from * TAU, to * TAU));
	}
}

export function vecAdd(v0, v1){
	return {
		x: v0.x + v1.x,
		y: v0.y + v1.y,
	};
}

export function vecSub(v0, v1){
	return {
		x: v0.x - v1.x,
		y: v0.y - v1.y,
	};
}

export function vecMul(v0, v1){
	return {
		x: v0.x * v1.x,
		y: v0.y * v1.y,
	};
}

export function vecScl(v, s){
	return {
		x: v.x * s,
		y: v.y * s,
	};
}

export function vecLength(v){
	return distance(0, 0, v.x, v.y);
}

export function vecNormalize(v){
	return vecScl(v, 1 / vecLength(v));
}

export function vecDiscreteLength(v, step){
	let l = vecLength(v);
	return vecScl(vecNormalize(v), Math.floor(l / step) * step);
}

export function worldToScreen(p, world){
	return {
		x: p.x * world.scale.x + world.position.x, 
		y: p.y * world.scale.y + world.position.y
	};
}

export function pointInsideRect(point, rect){
	return rect.x < point.x && point.x < (rect.x + rect.width) &&
	       rect.y < point.y && point.y < (rect.y + rect.height);
}

export function destroyed(displayObject){
	return !(displayObject?.transform);
}

export function lastIndex(array){
	return array.length - 1;
}

export function last(array){
	return array[array.length - 1]
}

export function arraySum(a){
	return a.reduce((p, c) => p + c, 0);
}

export function selectSegmentWithNormal(part, a){
	let selector = arraySum(a) * part;
	let i = 0;
	for (; selector > arraySum(a.slice(0, i + 1)); ++i){}
	
	const segmentIndex = i >= a.length ? a.length - 1 : i;
	const beforeSegment = arraySum(a.slice(0, Math.max(segmentIndex, 0)));
	const innerPart = remap(selector, beforeSegment, beforeSegment + a[segmentIndex], 0, 1)
	return {
		index: segmentIndex,
		innerPartNormalized: innerPart
	};
}

export function pointFromEvent(e){
	return {
		x: e.data.global.x,
		y: e.data.global.y
	};
}

export function pathLength(p){
	let sigma = 0;
	for (let i = 0; i < p.length - 1; ++i){
		let p0 = p[i];
		let p1 = p[i + 1];
		sigma += distance(p0.x, p0.y, p1.x, p1.y);
	}
	return sigma;
}

export function encodeColor(r, g, b){
	return ((r * 0xFF) << 16) + 
	       ((g * 0xFF) << 8) + 
	       (b * 0xFF)
}

export function range(from, to){
	let r = [];
	for (let i = from; i < to; ++i) r.push(i);
	return r;
}