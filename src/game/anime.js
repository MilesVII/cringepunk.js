import * as Utils from "./utils.js"

const DEFAULT_DURATION_MS = 320;
const DEBUG_FACTOR = 1;
let animations = []; //myAnimeList

function updateAnimation(anime){
	const now = Date.now();
	if (now < anime.start) return;

	let complete = false;
	let progress = (now - anime.start) / (anime.duration * DEBUG_FACTOR);
	if (progress >= 1){
		progress = 1;
		if (anime.looped){
			let period = anime.period || anime.duration;
			anime.start += period
			if (anime.loopedCB) anime.loopedCB();
		} else {
			complete = true;
		}
	}

	try {
		anime.type(anime.easing(progress), anime);
	} catch(e) {
		console.error(`Error when updating animation at progress ${progress}, terminated`);
		console.error(anime);
		console.error(e);
		complete = true;
	}
	anime.complete = complete;
	if (complete && anime.completionCB) anime.completionCB();
}


/**
 * Creates and adds new animation to a list, returns created animation handler with editable options (anime)
 * @param sprite Animaion's target, will be passed to animationType callback as anime.sprite as is
 * @param animationType : (progress, anime) => {} // Animaion's update callback
 * @param options Options. Different animation types may support special options. Main options are: 
 * 
 * 	- start | delay : now | 0 // Time in milliseconds when animation will start
 * 	- duration : 320 // Duration time in milliseconds
 * 	- easing : x => x // Easing function affecting progress value for {type} callback
 * 	- looped : false // If true, will start over when animation is over
 * 	- ignoreFirstDelay : false // If looped, will start animation immediately
 * 	- period : duration // Period of looping animation, includes duration of active phase
 * 	- idle : false // If true, animation will be ignored by {animationsEmpty()}
 * 	- loopedCB : // Called when animation loop is complete
 * 	- completionCB : // Called after last update
 */
export function create(sprite, animationType, options){
	const now = Date.now();
	let meta = Object.assign({
		duration: DEFAULT_DURATION_MS,
		start: now,
		easing: x => x
	}, options);
	if (options?.delay) meta.start = now + options.delay;
	meta.type = animationType;
	meta.complete = false;

	let anime = Object.assign(meta, {
		sprite,
		animationType
	});

	if (anime.looped && anime.ignoreFirstDelay) {
		meta.start = now;
	}

	animations.push(anime);

	return anime;
}

/** Helper function for creating series of consequent animations
 * @param durations Array of durations in MS for each episode
 * @return handler with two methods: episode(), which acts like Anime.create, while adding new anime to series, and terminate(), which terminates every anime in series
 */
export function series(durations){
	const period = Utils.arraySum(durations);
	let episodes = [];

	function episode(sprite, type, options){
		const counter = episodes.length;
		if (counter >= durations.length){
			console.error("Can't add more episodes to anime series");
			return;
		}
		
		Object.assign(options, {
			looped: true,
			delay: Utils.arraySum(durations.slice(0, counter)),
			duration: durations[counter],
			period: period
		});

		let newStage = create(sprite, type, options);
		episodes.push(newStage);
		return newStage;
	}

	return {
		episode: episode,
		terminate: () => episodes.forEach(a => terminate(a, true))
	};
}

export function terminate(anime, skipLastFrame = false){
	//yamete
	if (!animations.includes(anime)) return;
	if (!skipLastFrame) anime.type(anime.easing(1), anime);
	anime.complete = true;
	animations = animations.filter(a => !a.complete);
}

export function update(){
	for (let a of animations){
		updateAnimation(a);
	}
	animations = animations.filter(a => !a.complete);
};

export function animationsEmpty(){
	return animations.filter(a => !a.idle).length == 0;
}

export function reset(){
	animations = [];
}

export function MOVE(p, a){
	const pos = {
		x: Utils.lerp(p, a.from.x, a.to.x),
		y: Utils.lerp(p, a.from.y, a.to.y)
	};

	a.sprite.position.set(pos.x, pos.y);
}

export function INFLATE(p, a){
	const amplitude = a.amplitude || 1.2;
	const scale = Utils.lerp(p, 1.0, amplitude);
	a.sprite.scale.set(scale);
}

export function TINT_GREEN(p, a){
	a.sprite.tint = Utils.encodeColor(1 - p, 1, 1 - p);
}

export function JUMP(p, a){
	const jumpOut = (a.direction || "out") == "out";
	const scale = jumpOut ? 1 - p : p;
	a.sprite.scale.set(scale);
}

export function FADE(p, a){
	const fadeOut = (a.direction || "out") == "out";
	const alpha = fadeOut ? 1 - p : p;
	a.sprite.alpha = alpha;
}

export function ROTATE(p, a){
	const from = a.from || 0;
	const to = a.to || 0;
	a.sprite.rotation = Utils.lerp(p, from, to);
}

export function SHAKE(p, a){
	const amplitude = a.amplitude || 32;
	const offset = {
		x: amplitude * 2 * Math.random() - amplitude,
		y: amplitude * 2 * Math.random() - amplitude
	}
	a.sprite.position.set(offset.x, offset.y);
}