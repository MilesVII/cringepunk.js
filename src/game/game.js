import * as PIXI from "pixi.js";
import * as Anime from "./anime.js";
import * as Gfx from "./sprites.js";
import * as Sfx from "./sounding.js";
import * as Flow from "./director.js";
import * as Utils from "./utils.js";
import * as ads from "../ads/ads_api.js";
import { createSpine } from "./spine.js";

let world;
let guiContainer;

let screen = null;
let resizables = [];
let jsons = null;
let texts = null;
let sounds = null;

function registerResizable(sprite, resizeCallback){
	resizables.push({
		sprite: sprite, 
		cb: resizeCallback
	});
	sprite.on("destroyed", () => {
		resizables = resizables.filter(r => r.sprite != sprite);
	});
	updateResizable(resizeCallback, sprite);
}

function addConstraint(sprite, relative, x, y, width, height){
	registerResizable(sprite, (me, screenWidth, screenHeight, _width, _height) => {
		const absolute = (r, x, max) => r ? x * max : x;
		if (x)
			me.position.x = absolute(relative, x, screenWidth);
		if (y)
			me.position.y = absolute(relative, y, screenHeight);
		let scalingFactors = [];
		if (width)
			scalingFactors.push(absolute(relative, width, screenWidth) / _width);
		if (height)
			scalingFactors.push(absolute(relative, height, screenHeight) / _height);
		if (scalingFactors.length > 0) me.scale.set(Math.min(...scalingFactors));
	});
}

function updateResizables(){
	resizables.forEach(v => updateResizable(v.cb, v.sprite));
}

function updateResizable(cb, s){
	let localSize = null;
	try { 
		let lb = s.texture || s.getLocalBounds();
		localSize = {
			w: lb.width,
			h: lb.height
		};
	} catch(e){}
	cb(s, screen.w, screen.h, localSize.w, localSize.h);
}

const BACK_FILL = (me, w, h, _w, _h) => {
	if (w/h < _w/_h){
		me.scale.set(h / _h);
	} else {
		me.scale.set(w / _w);
	}
	me.position.set((me.width - w) * -.5, (me.height - h) * -.5);
};

function createWorld(container){
	registerResizable(container, BACK_FILL);

	function fromRelative(p){
		const lb = container.getLocalBounds();
		return {
			x: p.x * lb.width,
			y: p.y * lb.height
		};
	}
	return {
		container,
		fromRelative,
		size: container.getLocalBounds()
	}
}

export function start(app, environment){
	Gfx.setTextureMap(environment.textures);

	jsons = environment.jsons;
	texts = environment.texts;
	sounds = environment.sounds;
	Object.keys(jsons).forEach(k => jsons[k] = JSON.parse(jsons[k]));
	Object.keys(sounds).forEach(k => Sfx.load(k, sounds[k]));

	// The idea is to have two containers, one for UI which will be drawn upon everything and won't be transformed
	// And the other for world, which will be panned and zoomed by camera if needed
	Flow.state.containers = {
		gui: new PIXI.Container(),
		world: new PIXI.Container()
	};
	
	resize(window.innerWidth, window.innerHeight);

	app.stage.addChild(Flow.state.containers.world, Flow.state.containers.gui);

	app.ticker.add(dt => mainloop(dt, app));
}

export function resize(w, h){
	screen = {
		w: w,
		h: h
	};

	Flow.state.containers.gui.position.set(0, 0);

	updateResizables();
}

function pointFromEvent(e){
	return {
		x: e.data.originalEvent.layerX,
		y: e.data.originalEvent.layerY
	};
}


////////////////////////////////////////////////////////////////
// Scenario
// Any game-specific code usually goes here


function tileAnimated(spriteIds, w, h){
	let c = new PIXI.Container();

	for (let y = 0; y < h; ++y)
	for (let x = 0; x < w; ++x){
		let animation = new PIXI.AnimatedSprite(spriteIds.map(id => Gfx.getTexture(id)));
		
		animation.animationSpeed = .2;
		animation.loop = true;
		animation.play();

		let dims = animation.getLocalBounds();
		animation.position.x = x * dims.width;
		animation.position.y = y * dims.height;
		c.addChild(animation);
	}

	return c;
}

function mainloop(){
	Anime.update();
	Flow.runStages(SCENARIO);
}

// Each stage in scenario is an object consisting of 2 callbacks:
// start(state), which is called once, when stage starts, and provides 'states' object that is shared between stages
// isCompleted(state), which is called every frame update, and as soon as value it returns is truthy, the next stage starts
const SCENARIO = [
	{ // Stage I: Init background and add it to the world container
		start: state => {
			
			// Background is usually a static picture
			// But we can use whatever container we need...
			const backFrameIds = Utils.range(0, 27).map(i => "back_" + i);
			state.back = createWorld(tileAnimated(backFrameIds, 4, 4));
			state.containers.world.addChild(state.back.container);
			// ... just don't forget to refresh the resizable so the background would fit the screen
			updateResizables();

			/* 
			* The idea of resizables is to automatically track and adjust sprites
			* to screen size, scaling and repositioning them
			* To do that, you call registerResizable() and provide it your sprite and resizing callback
			* OR you call addConstraint and just fill in desired position and size
			 */
		},
		isCompleted: () => true
	},
	{ // Stage II: add text and spine animation
		start: state => {
			// Adding CTA text to the scene
			let text = Gfx.createText("OMFG!!!!!11!1!!one1one!\nIT'S ANOTHER PLAYABLE BULLSHID AD\nCLICK IT RIGHT NOW\nthis is a threat");
			Gfx.alignPivot(text, .5, .5);
			// wrapAnimable just wraps provided PIXI container into another one
			// The point is if you use resizables, you can't properly control sprite scale and position,
			// but if you want to animate it, you will probably modify it's scaling,
			// so in order to maintain two scaling factors we use nested containers
			text = Gfx.wrapAnimable(text);

			//This will make the text block adjust to screen size each time window is resized
			addConstraint(text.resizable, true, .5, .2, .8, .3);

			text.animable.scale.set(0);
			Anime.create(text.animable, Anime.ROTATE, {
				delay: 300,
				duration: 1200,
				//Animation-specific options:
				from: 0,
				to: Utils.TAU * 2
			});
			Anime.create(text.animable, Anime.JUMP, {
				delay: 300,
				duration: 1200,
				easing: Utils.easings.inOutCubic,
				//Animation-specific options:
				direction: "in"
			});
			Anime.create(text.animable, Anime.INFLATE, {
				delay: 300 + 1200,
				period: 2000,
				duration: 600,
				easing: Utils.easings.parabola,
				looped: true,
				idle: true
			});

			const sp = createSpine("spine_gfx", jsons.spine_json, texts.spine_atlas);
			sp.skeleton.setSkinByName("F5");
			sp.state.setAnimation(0, "idle", true);
			sp.alpha = 0;

			const fish = Gfx.wrapAnimable(sp);

			addConstraint(fish.resizable, true, .5, .5, .7, .7); 

			Anime.create(fish.animable, Anime.FADE, {
				delay: 100,
				duration: 700,
				//Animation-specific options:
				direction: "in"
			})

			state.fish = sp;
			state.containers.world.addChild(fish.resizable, text.resizable);
		},
		isCompleted: () => Anime.animationsEmpty()
	},
	{
		start: state => {
			state.fishClicked = false;

			state.containers.world.interactive = true;
			state.containers.world.once("pointerdown", () => {
				state.fish.state.setAnimation(0, "fish_attack", true);
				state.fishClicked = true;
			})
		},
		isCompleted: state => state.fishClicked
	},
	{
		start: state => {
			let button = Gfx.createSprite("button", .5, .5);

			button.interactive = true;
			button.on("pointerdown", () => ads.openStoreLink());

			button = Gfx.wrapAnimable(button);

			addConstraint(button.resizable, true, .5, .85, .9, .3);

			button.animable.alpha = 0;
			Anime.create(button.animable, Anime.FADE, {
				delay: 200,
				duration: 700,
				direction: "in"
			});
			Anime.create(button.animable, Anime.ROTATE, {
				delay: 200,
				duration: 1200,
				easing: Utils.easings.outBack,
				completionCB: () => {
				},
				from: 0,
				to: Utils.TAU * 6
			});
			Anime.create(button.animable, Anime.INFLATE, {
				delay: 200 + 1200,
				period: 2000,
				duration: 600,
				easing: Utils.easings.parabola,
				looped: true,
				idle: true
			});

			state.containers.gui.addChild(button.resizable);
		},
		isCompleted: () => false
	},
];