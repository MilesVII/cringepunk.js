let currentStage = -1;
let coldStart = true;
export const state = {};
export let restartCounter = 0;

export function runStages(scenario){
	if (coldStart || scenario[currentStage].isCompleted(state)){
		currentStage += 1;
		coldStart = false;
		if (currentStage == scenario.length) return true;
		scenario[currentStage].start(state);
	}
	return false;
}

export function restart(){
	coldStart = true;
	currentStage = -1;
	++restartCounter;
}
