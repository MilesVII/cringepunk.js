let volume = 1;
let sounds = [];
const loadedSounds = new Map();

export function load(key, url){
	loadedSounds.set(key, new Audio(url));
}

export function setVolume(v){
	volume = v;
	loadedSounds.forEach(s => s.volume = v);
}

export function getSound(key){
	if (!loadedSounds.has(key)) {
		console.error(`Requsted to play "${key}", which is not loaded`)
		return null;
	}
	const sound = loadedSounds.get(key);
	sound.currentTime = 0;
	sound.volume = volume;
	sounds.push(sound);

	return {
		play: (looped = false) => {
			sound.loop = looped;
			sound.play();
		},
		stop: () => {
			sound.pause();
			sound.currentTime = 0;
		},
		isPlaying: () => !(sound.paused || sound.ended)
	};
}